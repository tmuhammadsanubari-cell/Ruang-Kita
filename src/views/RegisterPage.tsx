// View - Register Page
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../controllers/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Building2, Mail, Lock, User, ArrowLeft } from 'lucide-react';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: () => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export function RegisterPage({ onNavigateToLogin, onRegisterSuccess, showError, showSuccess }: RegisterPageProps) {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password.length < 6) {
      showError('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    
    const success = await register(registerData.name, registerData.email, registerData.password);
    
    setIsLoading(false);
    
    if (success) {
      showSuccess('Registrasi berhasil! Selamat datang di Campus Facilities');
      onRegisterSuccess();
    } else {
      showError('Registrasi gagal. Email mungkin sudah terdaftar');
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
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onNavigateToLogin}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Login
        </motion.button>

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
          <p className="text-slate-500 text-center mt-2">Buat Akun Baru</p>
        </motion.div>

        <Card className="p-8 backdrop-blur-sm bg-white/80 border-slate-200/50 shadow-xl">
          <h2 className="text-slate-900 mb-6 text-center">Daftar Sekarang</h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-name">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Nama lengkap"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="register-email"
                  type="email"
                  placeholder="nama@kampus.ac.id"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-slate-500">Gunakan minimal 6 karakter</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Daftar'}
            </Button>

            <div className="text-center text-sm text-slate-600 pt-4">
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Masuk di sini
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
