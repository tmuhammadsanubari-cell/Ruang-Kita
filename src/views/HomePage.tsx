// View - Home Page (Apple-inspired)
import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { ArrowRight, Building2, Calendar, CheckCircle, Shield, Zap, Users } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: Calendar,
      title: 'Reservasi Mudah',
      description: 'Pesan fasilitas kampus dalam hitungan detik dengan interface yang intuitif'
    },
    {
      icon: CheckCircle,
      title: 'Persetujuan Cepat',
      description: 'Sistem notifikasi real-time untuk update status reservasi Anda'
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Data Anda terlindungi dengan sistem keamanan tingkat enterprise'
    },
    {
      icon: Zap,
      title: 'Akses Instan',
      description: 'Lihat ketersediaan fasilitas secara real-time kapan saja'
    }
  ];

  const stats = [
    { number: '50+', label: 'Fasilitas' },
    { number: '1000+', label: 'Pengguna' },
    { number: '5000+', label: 'Reservasi' },
    { number: '99%', label: 'Kepuasan' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/40 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-teal-200/40 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-6"
            >
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-emerald-700">Sistem Reservasi Modern</span>
            </motion.div>

            <h1 className="text-slate-900 mb-6 max-w-4xl mx-auto">
              Reservasi Fasilitas Kampus.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Lebih Cepat. Lebih Mudah.
              </span>
            </h1>

            <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
              Platform modern untuk mengelola dan mereservasi fasilitas kampus dengan teknologi terdepan.
              Dirancang untuk memberikan pengalaman terbaik bagi civitas akademika.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => onNavigate('facilities')}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30"
                >
                  Jelajahi Fasilitas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => onNavigate('my-reservations')}
                  size="lg"
                  variant="outline"
                  className="border-slate-300"
                >
                  Lihat Reservasi
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1760131556605-7f2e63d00385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYW1wdXMlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjA4NDM2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Campus Building"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-slate-900 mb-2">{stat.number}</div>
                <div className="text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-slate-900 mb-4">
              Fitur yang Dirancang untuk Anda
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Sistem reservasi yang powerful namun mudah digunakan, dengan fitur-fitur yang mendukung kebutuhan kampus modern.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white mb-6">
              Siap Memulai?
            </h2>
            <p className="text-emerald-50 mb-12 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pengguna yang telah merasakan kemudahan reservasi fasilitas kampus dengan sistem kami.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => onNavigate('facilities')}
                size="lg"
                className="bg-white text-emerald-600 hover:bg-slate-50"
              >
                Mulai Sekarang
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
