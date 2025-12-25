// View - Admin Dashboard
import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../controllers/DataContext';
import { Card } from '../components/ui/card';
import { Building2, Calendar, CheckCircle, Clock } from 'lucide-react';

export function AdminDashboard() {
  const { facilities, reservations } = useData();

  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const approvedReservations = reservations.filter(r => r.status === 'approved');
  const availableFacilities = facilities.filter(f => f.status === 'available');

  const stats = [
    {
      icon: Building2,
      label: 'Total Fasilitas',
      value: facilities.length,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Clock,
      label: 'Menunggu Approval',
      value: pendingReservations.length,
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: CheckCircle,
      label: 'Reservasi Disetujui',
      value: approvedReservations.length,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Calendar,
      label: 'Total Reservasi',
      value: reservations.length,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const recentReservations = reservations
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="bg-gradient-to-br from-emerald-50 to-white py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-slate-900 mb-4">Dashboard Admin</h1>
            <p className="text-slate-600">
              Kelola fasilitas dan reservasi kampus
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all border-slate-200">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-slate-900 mb-6">Aktivitas Terbaru</h2>
          <Card className="divide-y divide-slate-200">
            {recentReservations.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-600">Belum ada aktivitas</p>
              </div>
            ) : (
              recentReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-slate-900 mb-1">{reservation.facilityName}</h3>
                      <p className="text-sm text-slate-600 mb-2">
                        oleh {reservation.userName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {reservation.date.toLocaleDateString('id-ID')} • {reservation.startTime} - {reservation.endTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {reservation.status === 'pending' && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                          Menunggu
                        </span>
                      )}
                      {reservation.status === 'approved' && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                          Disetujui
                        </span>
                      )}
                      {reservation.status === 'rejected' && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Ditolak
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
