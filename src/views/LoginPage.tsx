// View - Login Page
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../controllers/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Building2, Mail, Lock } from 'lucide-react';

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
  showError: (message: string) => void;
}

export function LoginPage({ onNavigateToRegister, onLoginSuccess, showError }: LoginPageProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(loginData.email, loginData.password);
    
    setIsLoading(false);
    
    if (success) {
      onLoginSuccess();
    } else {
      showError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-teal-200/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-slate-900 text-center">RuangKita</h1>
          <p className="text-slate-500 text-center mt-2">Sistem Reservasi Fasilitas Kampus</p>
        </motion.div>

        <Card className="p-8 backdrop-blur-sm bg-white/80 border-slate-200/50 shadow-xl">
          <h2 className="text-slate-900 mb-6 text-center">Masuk ke Akun Anda</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="nama@kampus.ac.id"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="masukkan password (6 huruf)"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>

            <div className="text-center text-sm text-slate-600 pt-4">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Daftar di sini
              </button>
            </div>

            <div className="text-center text-xs text-slate-500 mt-4 pt-4 border-t border-slate-200">
              <p className="mb-1">Demo Accounts:</p>
              <p>Admin: admin@kampus.ac.id / admin123</p>
              <p>User: user@kampus.ac.id / user123</p>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
