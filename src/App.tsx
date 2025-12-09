import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './controllers/AuthContext';
import { DataProvider } from './controllers/DataContext';
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
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const { notifications, dismissNotification, showSuccess, showError, showWarning, showInfo } = useNotifications();
  
  const [isInitialized, setIsInitialized] = useState(false);

  // --- LOGIC NAVIGASI BROWSER (HISTORY API) ---

  // 1. Listener untuk menangani tombol Back/Forward Browser
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Jika user tidak login, jangan biarkan navigasi history mengubah state aplikasi
      // Tampilan akan tetap terkunci di Login Page karena return di bawah
      if (!isAuthenticated) return;

      if (event.state) {
        // Kembalikan halaman sesuai history
        if (event.state.page) {
          setCurrentPage(event.state.page);
        }
        // Kembalikan data fasilitas jika ada (untuk halaman detail)
        if (event.state.facility) {
          setSelectedFacility(event.state.facility);
        } else {
          setSelectedFacility(null);
        }
      } else {
        // Fallback jika history kosong (kembali ke home/dashboard default)
        const defaultPage = user?.role === 'admin' ? 'admin-dashboard' : 'home';
        setCurrentPage(defaultPage);
        setSelectedFacility(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, user]);

  // 2. Fungsi Navigasi yang diperbarui dengan Push State
  const handleNavigate = (page: string) => {
    // Push state baru ke browser history agar tombol back berfungsi
    // Argumen: state object, title (kosong), url (opsional, kita biarkan kosong agar tetap di root)
    window.history.pushState({ page, facility: null }, '', '');
    
    setCurrentPage(page);
    setSelectedFacility(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Fungsi Detail Fasilitas yang diperbarui dengan Push State
  const handleViewFacilityDetail = (facility: Facility) => {
    // Simpan data fasilitas di history state agar saat di-back datanya ada lagi
    window.history.pushState({ page: 'facility-detail', facility }, '', '');
    
    setSelectedFacility(facility);
    setCurrentPage('facility-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Inisialisasi Redirect Login & Reset History
  useEffect(() => {
    if (isAuthenticated && user && !isInitialized) {
      const startPage = user.role === 'admin' ? 'admin-dashboard' : 'home';
      setCurrentPage(startPage);
      
      // Saat baru login, kita REPLACE state history saat ini.
      // Ini mencegah user menekan tombol "Back" untuk kembali ke halaman Login.
      window.history.replaceState({ page: startPage, facility: null }, '', '');
      
      setIsInitialized(true);
    }
  }, [isAuthenticated, user, isInitialized]);

  // 5. Reset saat Logout
  useEffect(() => {
    if (!isAuthenticated) {
      setIsInitialized(false);
      // Opsional: Bersihkan history state saat logout agar bersih
      window.history.replaceState(null, '', '');
    }
  }, [isAuthenticated]);

  // --- END LOGIC NAVIGASI ---

  const handleLoginSuccess = () => {
    showSuccess('Login berhasil! Selamat datang kembali');
  };

  const handleRegisterSuccess = () => {
    showSuccess('Registrasi berhasil! Selamat datang di Campus Facilities');
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
      
      {/* User Routes */}
      {user?.role === 'user' && (
        <>
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'facilities' && <FacilitiesPage onViewDetail={handleViewFacilityDetail} />}
          {currentPage === 'facility-detail' && selectedFacility && (
            <FacilityDetailPage
              facility={selectedFacility}
              onBack={() => {
                // Gunakan history.back() untuk tombol UI "Kembali" agar sinkron dengan browser
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