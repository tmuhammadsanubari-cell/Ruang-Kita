import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './controllers/AuthContext';
import { DataProvider, useData } from './controllers/DataContext'; // Tambahkan useData
import { LoginPage } from './views/LoginPage';
import { RegisterPage } from './views/RegisterPage';
import { HomePage } from './views/HomePage';
import { FacilitiesPage } from './views/FacilitiesPage';
import { FacilityDetailPage } from './views/FacilityDetailPage';
import { MyReservationsPage } from './views/MyReservationsPage';
import { AdminDashboard } from './views/AdminDashboard';
import { ManageFacilitiesPage } from './views/ManageFacilitiesPage';
import { ManageReservationsPage } from './views/ManageReservationsPage';
import { Navbar } from './components/Navbar';
import { NotificationPopup, useNotifications } from './components/NotificationPopup';
import { Facility } from './models/types';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const { reservations } = useData(); // Ambil data reservasi dari context
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const { notifications, dismissNotification, showSuccess, showError } = useNotifications();
  
  const [isInitialized, setIsInitialized] = useState(false);

  // State untuk melacak status terakhir setiap reservasi agar notifikasi tidak muncul berulang
  const [lastStatusMap, setLastStatusMap] = useState<Record<string, string>>({});

  // --- LOGIK NOTIFIKASI REAL-TIME ---
  useEffect(() => {
    // Hanya jalankan pengecekan jika user adalah 'user' dan ada data reservasi
    if (user?.role === 'user' && reservations.length > 0) {
      reservations.forEach((res) => {
        // Hanya cek reservasi milik user yang sedang login
        if (res.userId === user.id) {
          const previousStatus = lastStatusMap[res.id];
          
          // Deteksi perubahan status dari 'pending' ke status lainnya (approved/rejected)
          if (previousStatus === 'pending' && res.status !== 'pending') {
            if (res.status === 'approved') {
              showSuccess(`Selamat! Reservasi Anda di "${res.facilityName}" telah DISETUJUI oleh Admin.`);
            } else if (res.status === 'rejected') {
              showError(`Maaf, reservasi Anda di "${res.facilityName}" DITOLAK. Alasan: ${res.adminNote || 'Tidak ada catatan.'}`);
            }
          }
        }
      });

      // Perbarui map status terakhir berdasarkan data reservasi terbaru
      const newStatusMap = reservations.reduce((acc, res) => ({
        ...acc,
        [res.id]: res.status
      }), {});
      
      setLastStatusMap(newStatusMap);
    }
  }, [reservations, user, showSuccess, showError]);
  // --- END LOGIK NOTIFIKASI ---


  // --- LOGIC NAVIGASI BROWSER (HISTORY API) ---
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (!isAuthenticated) return;

      if (event.state) {
        if (event.state.page) {
          setCurrentPage(event.state.page);
        }
        if (event.state.facility) {
          setSelectedFacility(event.state.facility);
        } else {
          setSelectedFacility(null);
        }
      } else {
        const defaultPage = user?.role === 'admin' ? 'admin-dashboard' : 'home';
        setCurrentPage(defaultPage);
        setSelectedFacility(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, user]);

  const handleNavigate = (page: string) => {
    window.history.pushState({ page, facility: null }, '', '');
    setCurrentPage(page);
    setSelectedFacility(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewFacilityDetail = (facility: Facility) => {
    window.history.pushState({ page: 'facility-detail', facility }, '', '');
    setSelectedFacility(facility);
    setCurrentPage('facility-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAuthenticated && user && !isInitialized) {
      const startPage = user.role === 'admin' ? 'admin-dashboard' : 'home';
      setCurrentPage(startPage);
      window.history.replaceState({ page: startPage, facility: null }, '', '');
      setIsInitialized(true);
    }
  }, [isAuthenticated, user, isInitialized]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsInitialized(false);
      window.history.replaceState(null, '', '');
      setLastStatusMap({}); // Reset tracking status saat logout
    }
  }, [isAuthenticated]);
  // --- END LOGIC NAVIGASI ---


  const handleLoginSuccess = () => {
    showSuccess('Login berhasil! Selamat datang kembali');
  };

  const handleRegisterSuccess = () => {
    showSuccess('Registrasi berhasil! Selamat datang di RuangKita');
  };

  if (!isAuthenticated) {
    return (
      <>
        {authPage === 'login' ? (
          <LoginPage
            onNavigateToRegister={() => setAuthPage('register')}
            onLoginSuccess={handleLoginSuccess}
            showError={showError}
          />
        ) : (
          <RegisterPage
            onNavigateToLogin={() => setAuthPage('login')}
            onRegisterSuccess={handleRegisterSuccess}
            showError={showError}
            showSuccess={showSuccess}
          />
        )}
        <NotificationPopup notifications={notifications} onDismiss={dismissNotification} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      <main className="pt-20"> {/* Tambahkan padding top agar tidak tertutup Navbar */}
        {/* User Routes */}
        {user?.role === 'user' && (
          <>
            {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
            {currentPage === 'facilities' && <FacilitiesPage onViewDetail={handleViewFacilityDetail} />}
            {currentPage === 'facility-detail' && selectedFacility && (
              <FacilityDetailPage
                facility={selectedFacility}
                onBack={() => {
                  window.history.back(); 
                }}
                showSuccess={showSuccess}
                showError={showError}
              />
            )}
            {currentPage === 'my-reservations' && <MyReservationsPage />}
          </>
        )}

        {/* Admin Routes */}
        {user?.role === 'admin' && (
          <>
            {currentPage === 'admin-dashboard' && <AdminDashboard />}
            {currentPage === 'manage-facilities' && (
              <ManageFacilitiesPage
                showSuccess={showSuccess}
                showError={showError}
              />
            )}
            {currentPage === 'manage-reservations' && (
              <ManageReservationsPage
                showSuccess={showSuccess}
                showError={showError}
              />
            )}
          </>
        )}
      </main>

      {/* Komponen Notifikasi Global */}
      <NotificationPopup notifications={notifications} onDismiss={dismissNotification} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}