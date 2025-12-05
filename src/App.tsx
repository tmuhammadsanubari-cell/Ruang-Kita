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

  // Auto-redirect to home page when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('home');
      }
    }
  }, [isAuthenticated, user]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedFacility(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewFacilityDetail = (facility: Facility) => {
    setSelectedFacility(facility);
    setCurrentPage('facility-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              onBack={() => handleNavigate('facilities')}
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
