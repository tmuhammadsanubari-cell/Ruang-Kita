// Controller - Data Management Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Facility, Reservation, ReservationStatus } from '../models/types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface DataContextType {
  facilities: Facility[];
  reservations: Reservation[];
  addFacility: (facility: Omit<Facility, 'id' | 'createdAt'>) => void;
  updateFacility: (id: string, facility: Partial<Facility>) => void;
  deleteFacility: (id: string) => void;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>, onSuccess?: () => void) => void;
  updateReservationStatus: (id: string, status: ReservationStatus, adminNote?: string, onSuccess?: () => void) => void;
  deleteReservation: (id: string) => Promise<void>;
  getUserReservations: (userId: string) => Reservation[];
  getFacilityReservations: (facilityId: string) => Reservation[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Fungsi untuk mengambil data fasilitas
  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const loadedFacilities: Facility[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          capacity: item.capacity,
          location: item.location,
          status: item.status,
          description: item.description,
          image: item.image_url,
          features: item.features || [],
          createdAt: new Date(item.created_at)
        }));
        setFacilities(loadedFacilities);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  // Fungsi untuk mengambil data reservasi
  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`*, facilities (name), profiles (name)`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const loadedReservations: Reservation[] = data.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          userName: item.profiles?.name || 'Unknown User',
          facilityId: item.facility_id,
          facilityName: item.facilities?.name || 'Unknown Facility',
          date: new Date(item.date),
          startTime: item.start_time,
          endTime: item.end_time,
          purpose: item.purpose,
          status: item.status,
          adminNote: item.admin_note,
          createdAt: new Date(item.created_at)
        }));
        setReservations(loadedReservations);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  // Logic Real-time Subscription dan Fetching Awal
  useEffect(() => {
    fetchFacilities();
    
    if (user) {
      fetchReservations();

      // 1. Setup Real-time Subscription untuk tabel reservations
      // Ini mendengarkan setiap perubahan (INSERT, UPDATE, DELETE) di database
      const channel = supabase
        .channel('realtime-reservations')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'reservations' 
          },
          () => {
            // Ambil data terbaru setiap kali ada perubahan di database
            fetchReservations();
          }
        )
        .subscribe();

      // Bersihkan subscription saat komponen unmount atau user logout
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  // Manajemen Fasilitas
  const addFacility = async (facilityData: Omit<Facility, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase.from('facilities').insert([{
        name: facilityData.name,
        capacity: facilityData.capacity,
        location: facilityData.location,
        description: facilityData.description,
        status: facilityData.status,
        image_url: facilityData.image,
        features: facilityData.features
      }]);
      if (error) throw error;
      fetchFacilities();
    } catch (error) {
      console.error('Error adding facility:', error);
    }
  };

  const updateFacility = async (id: string, updates: Partial<Facility>) => {
    try {
      const dbUpdates: any = { ...updates };
      if (updates.image) {
        dbUpdates.image_url = updates.image;
        delete dbUpdates.image;
      }
      delete dbUpdates.id; 
      delete dbUpdates.createdAt;
      
      const { error } = await supabase.from('facilities').update(dbUpdates).eq('id', id);
      if (error) throw error;
      fetchFacilities();
    } catch (error) {
      console.error('Error updating facility:', error);
    }
  };

  const deleteFacility = async (id: string) => {
    try {
      const { error } = await supabase.from('facilities').delete().eq('id', id);
      if (error) throw error;
      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };

  // Manajemen Reservasi
  const addReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status'>, onSuccess?: () => void) => {
    try {
      // PERBAIKAN: Ambil komponen tanggal lokal (Tahun, Bulan, Hari) secara manual 
      // untuk menghindari pergeseran timezone UTC
      const year = reservationData.date.getFullYear();
      const month = String(reservationData.date.getMonth() + 1).padStart(2, '0');
      const day = String(reservationData.date.getDate()).padStart(2, '0');
      const localDateString = `${year}-${month}-${day}`; // Format: YYYY-MM-DD

      const { error } = await supabase.from('reservations').insert([{
        user_id: reservationData.userId,
        facility_id: reservationData.facilityId,
        date: localDateString, // Gunakan string tanggal lokal hasil rakitan manual
        start_time: reservationData.startTime,
        end_time: reservationData.endTime,
        purpose: reservationData.purpose,
        status: 'pending'
      }]);

      if (error) throw error;
      
      fetchReservations();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding reservation:', error);
      alert('Gagal membuat reservasi: ' + (error as any).message);
    }
  };

  const updateReservationStatus = async (id: string, status: ReservationStatus, adminNote?: string, onSuccess?: () => void) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: status, admin_note: adminNote })
        .eq('id', id);
        
      if (error) throw error;
      fetchReservations();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  };

  const getUserReservations = (userId: string) => reservations.filter(r => r.userId === userId);
  const getFacilityReservations = (facilityId: string) => reservations.filter(r => r.facilityId === facilityId);

  return (
    <DataContext.Provider
      value={{
        facilities,
        reservations,
        addFacility,
        updateFacility,
        deleteFacility,
        addReservation,
        updateReservationStatus,
        deleteReservation,
        getUserReservations,
        getFacilityReservations
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}