// View - Facility Detail Page with Reservation
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../controllers/AuthContext';
import { useData } from '../controllers/DataContext';
import { Facility } from '../models/types';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { 
  ArrowLeft, Users, MapPin, CheckCircle, AlertCircle, 
  Wrench, Calendar as CalendarIcon, Clock 
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface FacilityDetailPageProps {
  facility: Facility;
  onBack: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export function FacilityDetailPage({ facility, onBack, showSuccess, showError }: FacilityDetailPageProps) {
  const { user } = useAuth();
  const { addReservation, getFacilityReservations } = useData();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  const facilityReservations = getFacilityReservations(facility.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'maintenance':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Tersedia';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Tidak Tersedia';
    }
  };

  const handleReservation = () => {
    if (!selectedDate || !startTime || !endTime || !purpose) {
      showError('Mohon lengkapi semua data reservasi');
      return;
    }

    if (startTime >= endTime) {
      showError('Waktu selesai harus lebih besar dari waktu mulai');
      return;
    }

    addReservation({
      userId: user!.id,
      userName: user!.name,
      facilityId: facility.id,
      facilityName: facility.name,
      date: selectedDate,
      startTime,
      endTime,
      purpose
    }, () => {
      showSuccess('Reservasi berhasil diajukan! Menunggu persetujuan admin');
    });

    setShowCalendar(false);
    setSelectedDate(undefined);
    setStartTime('');
    setEndTime('');
    setPurpose('');
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </motion.button>
      </div>

      {/* Hero Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[400px] rounded-3xl overflow-hidden"
        >
          <ImageWithFallback
            src={facility.image}
            alt={facility.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <Badge className={`${getStatusColor(facility.status)} border gap-1 mb-4`}>
              {getStatusIcon(facility.status)}
              {getStatusLabel(facility.status)}
            </Badge>
            <h1 className="mb-2">{facility.name}</h1>
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Kapasitas: {facility.capacity} orang</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{facility.location}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8">
                <h2 className="text-slate-900 mb-4">Deskripsi</h2>
                <p className="text-slate-600">{facility.description}</p>
              </Card>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8">
                <h2 className="text-slate-900 mb-4">Fasilitas</h2>
                <div className="flex flex-wrap gap-3">
                  {facility.features.map((feature) => (
                    <Badge
                      key={feature}
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8">
                <h2 className="text-slate-900 mb-4">Reservasi Mendatang</h2>
                {facilityReservations.filter(r => r.status === 'approved').length === 0 ? (
                  <p className="text-slate-500">Belum ada reservasi yang disetujui</p>
                ) : (
                  <div className="space-y-3">
                    {facilityReservations
                      .filter(r => r.status === 'approved')
                      .slice(0, 5)
                      .map((reservation) => (
                        <div
                          key={reservation.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-sm text-slate-900">
                                {reservation.date.toLocaleDateString('id-ID')}
                              </p>
                              <p className="text-xs text-slate-500">
                                {reservation.startTime} - {reservation.endTime}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">Dipesan</Badge>
                        </div>
                      ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Reservation Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <Card className="p-8">
                <h2 className="text-slate-900 mb-6">Buat Reservasi</h2>
                
                {facility.status !== 'available' ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-700">
                      Fasilitas ini sedang tidak tersedia untuk reservasi
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={() => setShowCalendar(true)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Pilih Tanggal & Waktu
                    </Button>

                    {selectedDate && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-sm text-emerald-700">
                          Tanggal: {selectedDate.toLocaleDateString('id-ID')}
                        </p>
                        {startTime && endTime && (
                          <p className="text-sm text-emerald-700">
                            Waktu: {startTime} - {endTime}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-200 space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Kapasitas: {facility.capacity} orang</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{facility.location}</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Calendar Dialog */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reservasi {facility.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block">Pilih Tanggal</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className="rounded-lg border"
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="start-time">Waktu Mulai</Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="end-time">Waktu Selesai</Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="purpose">Tujuan Penggunaan</Label>
                <Textarea
                  id="purpose"
                  placeholder="Jelaskan tujuan reservasi..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="mt-2 resize-none"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleReservation}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                Ajukan Reservasi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}