// View - Admin Manage Reservations Page
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../controllers/DataContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Calendar, Clock, User, Building2, CheckCircle, XCircle } from 'lucide-react';
import { Reservation } from '../models/types';
import { toast } from 'sonner@2.0.3';

interface ManageReservationsPageProps {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export function ManageReservationsPage({ showSuccess, showError }: ManageReservationsPageProps) {
  const { reservations, updateReservationStatus } = useData();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const approvedReservations = reservations.filter(r => r.status === 'approved');
  const rejectedReservations = reservations.filter(r => r.status === 'rejected');

  const handleApprove = (reservation: Reservation) => {
    updateReservationStatus(reservation.id, 'approved', adminNote || undefined, () => {
      showSuccess('Reservasi berhasil disetujui');
    });
    setSelectedReservation(null);
    setAdminNote('');
  };

  const handleReject = (reservation: Reservation) => {
    if (!adminNote.trim()) {
      showError('Mohon berikan alasan penolakan');
      return;
    }
    updateReservationStatus(reservation.id, 'rejected', adminNote, () => {
      showSuccess('Reservasi berhasil ditolak');
    });
    setSelectedReservation(null);
    setAdminNote('');
  };

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <Card className="p-6 hover:border-emerald-300 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-slate-900 mb-2">{reservation.facilityName}</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{reservation.userName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {reservation.date.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{reservation.startTime} - {reservation.endTime}</span>
              </div>
            </div>
          </div>
          {reservation.status === 'pending' && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
              Menunggu
            </Badge>
          )}
          {reservation.status === 'approved' && (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              Disetujui
            </Badge>
          )}
          {reservation.status === 'rejected' && (
            <Badge className="bg-red-100 text-red-700 border-red-200">
              Ditolak
            </Badge>
          )}
        </div>

        <div className="p-4 bg-slate-50 rounded-lg mb-4">
          <p className="text-xs text-slate-500 mb-1">Tujuan:</p>
          <p className="text-sm text-slate-900">{reservation.purpose}</p>
        </div>

        {reservation.adminNote && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <p className="text-xs text-blue-700 mb-1">Catatan Admin:</p>
            <p className="text-sm text-blue-900">{reservation.adminNote}</p>
          </div>
        )}

        {reservation.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setSelectedReservation(reservation);
                setAdminNote('');
              }}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Setujui
            </Button>
            <Button
              onClick={() => {
                setSelectedReservation(reservation);
                setAdminNote('');
              }}
              variant="outline"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Tolak
            </Button>
          </div>
        )}

        <div className="text-xs text-slate-400 mt-4">
          Diajukan pada {reservation.createdAt.toLocaleString('id-ID')}
        </div>
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
            <h1 className="text-slate-900 mb-4">Kelola Reservasi</h1>
            <p className="text-slate-600">
              Setujui atau tolak permintaan reservasi dari pengguna
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="pending">
              Menunggu ({pendingReservations.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Disetujui ({approvedReservations.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Ditolak ({rejectedReservations.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              Semua ({reservations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {pendingReservations.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600">Tidak ada reservasi yang menunggu</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {pendingReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            {approvedReservations.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-slate-600">Tidak ada reservasi yang disetujui</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {approvedReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            {rejectedReservations.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-slate-600">Tidak ada reservasi yang ditolak</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {rejectedReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {reservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog
        open={!!selectedReservation}
        onOpenChange={() => {
          setSelectedReservation(null);
          setAdminNote('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedReservation?.facilityName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-4 h-4" />
                <span>{selectedReservation?.userName}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {selectedReservation?.date.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4" />
                <span>
                  {selectedReservation?.startTime} - {selectedReservation?.endTime}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2">Tujuan:</p>
              <p className="text-sm text-slate-900 p-3 bg-slate-50 rounded-lg">
                {selectedReservation?.purpose}
              </p>
            </div>

            <div>
              <Label htmlFor="admin-note">
                Catatan (Opsional untuk persetujuan, wajib untuk penolakan)
              </Label>
              <Textarea
                id="admin-note"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Berikan catatan atau alasan..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => selectedReservation && handleApprove(selectedReservation)}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Setujui
              </Button>
              <Button
                onClick={() => selectedReservation && handleReject(selectedReservation)}
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Tolak
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}