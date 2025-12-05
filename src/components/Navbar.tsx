// View Component - Navigation Bar
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../controllers/AuthContext';
import { Button } from './ui/button';
import { LogOut, Menu, X, Bell } from 'lucide-react';
import { useData } from '../controllers/DataContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, logout } = useAuth();
  const { reservations } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user?.role === 'user') {
      const userReservations = reservations.filter(r => r.userId === user.id);
      const hasUpdates = userReservations.some(r => 
        r.status === 'approved' || r.status === 'rejected'
      );
      setHasNotification(hasUpdates);
    } else if (user?.role === 'admin') {
      const hasPending = reservations.some(r => r.status === 'pending');
      setHasNotification(hasPending);
    }
  }, [reservations, user]);

  const navItems = user?.role === 'admin'
    ? [
        { name: 'Dashboard', value: 'admin-dashboard' },
        { name: 'Kelola Fasilitas', value: 'manage-facilities' },
        { name: 'Kelola Reservasi', value: 'manage-reservations' }
      ]
    : [
        { name: 'Beranda', value: 'home' },
        { name: 'Fasilitas', value: 'facilities' },
        { name: 'Reservasi Saya', value: 'my-reservations' }
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate(user?.role === 'admin' ? 'admin-dashboard' : 'home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white">RK</span>
            </div>
            <span className="text-slate-900 tracking-tight">RuangKita</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-sm transition-colors relative ${
                  currentPage === item.value
                    ? 'text-emerald-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.name}
                {currentPage === item.value && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(user?.role === 'admin' ? 'manage-reservations' : 'my-reservations')}
              className="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {hasNotification && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                />
              )}
            </motion.button>

            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-slate-200"
          >
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-sm ${
                  currentPage === item.value
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-slate-600'
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="px-4 py-3 border-t border-slate-200 mt-2">
              <p className="text-sm text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize mb-3">{user?.role}</p>
              <Button onClick={logout} variant="outline" size="sm" className="w-full gap-2">
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
