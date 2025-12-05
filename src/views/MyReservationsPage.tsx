// View - User Reservations Page
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../controllers/AuthContext';
import { useData } from '../controllers/DataContext';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export function MyReservationsPage() {
  const { user } = useAuth();
  const { getUserReservations } = useData();
  const reservations = getUserReservations(user!.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Menunggu
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disetujui
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Ditolak
          </Badge>
        );
      default:
        return null;
    }
  };

  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const approvedReservations = reservations.filter(r => r.status === 'approved');
  const rejectedReservations = reservations.filter(r => r.status === 'rejected');

  const ReservationCard = ({ reservation }: { reservation: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <Card className="p-6 hover:border-emerald-300 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-slate-900 mb-1">{reservation.facilityName}</h3>
            <p className="text-sm text-slate-500">
              Diajukan pada {reservation.createdAt.toLocaleDateString('id-ID')}
            </p>
          </div>
          {getStatusBadge(reservation.status)}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{reservation.date.toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span>{reservation.startTime} - {reservation.endTime}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 mb-1">Tujuan:</p>
          <p className="text-sm text-slate-900">{reservation.purpose}</p>
        </div>

        {reservation.adminNote && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 mb-1">Catatan Admin:</p>
            <p className="text-sm text-amber-900">{reservation.adminNote}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="bg-gradient-to-br from-emerald-50 to-white py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-slate-900 mb-4">Reservasi Saya</h1>
            <p className="text-slate-600">
              Kelola dan pantau semua reservasi fasilitas Anda
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">
              Semua ({reservations.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Menunggu ({pendingReservations.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Disetujui ({approvedReservations.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Ditolak ({rejectedReservations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {reservations.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600">Anda belum memiliki reservasi</p>
              </Card>
            ) : (
              reservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingReservations.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-slate-600">Tidak ada reservasi yang menunggu</p>
              </Card>
            ) : (
              pendingReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            {approvedReservations.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-slate-600">Tidak ada reservasi yang disetujui</p>
              </Card>
            ) : (
              approvedReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            {rejectedReservations.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-slate-600">Tidak ada reservasi yang ditolak</p>
              </Card>
            ) : (
              rejectedReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
