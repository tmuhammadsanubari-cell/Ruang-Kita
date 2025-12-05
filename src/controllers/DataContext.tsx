// Controller - Data Management Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Facility, Reservation, ReservationStatus, FacilityStatus } from '../models/types';
import { supabase } from '../lib/supabase'; // Pastikan path ini sesuai

interface DataContextType {
  facilities: Facility[];
  reservations: Reservation[];
  addFacility: (facility: Omit<Facility, 'id' | 'createdAt'>) => void;
  updateFacility: (id: string, facility: Partial<Facility>) => void;
  deleteFacility: (id: string) => void;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>, onSuccess?: () => void) => void;
  updateReservationStatus: (id: string, status: ReservationStatus, adminNote?: string, onSuccess?: () => void) => void;
  getUserReservations: (userId: string) => Reservation[];
  getFacilityReservations: (facilityId: string) => Reservation[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // --- FUNGSI FETCH DATA ---

  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Mapping dari Database (snake_case) ke Aplikasi (camelCase)
        const loadedFacilities: Facility[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          capacity: item.capacity,
          location: item.location,
          status: item.status,
          description: item.description,
          image: item.image_url, // Pastikan nama kolom di DB adalah image_url
          features: item.features || [],
          createdAt: new Date(item.created_at)
        }));
        setFacilities(loadedFacilities);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      // Kita perlu join ke tabel facilities dan profiles untuk dapat namanya
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          facilities (name),
          profiles (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const loadedReservations: Reservation[] = data.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          userName: item.profiles?.name || 'Unknown User', // Ambil dari relasi profiles
          facilityId: item.facility_id,
          facilityName: item.facilities?.name || 'Unknown Facility', // Ambil dari relasi facilities
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

  // Load data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchFacilities();
    fetchReservations();
  }, []);


  // --- FUNGSI CRUD FACILITIES ---

  const addFacility = async (facilityData: Omit<Facility, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('facilities')
        .insert([{
          name: facilityData.name,
          capacity: facilityData.capacity,
          location: facilityData.location,
          description: facilityData.description,
          status: facilityData.status,
          image_url: facilityData.image, // Simpan URL atau Base64 string
          features: facilityData.features
        }]);

      if (error) throw error;
      fetchFacilities(); // Refresh data
    } catch (error) {
      console.error('Error adding facility:', error);
    }
  };

  const updateFacility = async (id: string, updates: Partial<Facility>) => {
    try {
      // Siapkan object update, mapping key jika perlu
      const dbUpdates: any = { ...updates };
      if (updates.image) {
        dbUpdates.image_url = updates.image;
        delete dbUpdates.image;
      }
      // Hapus field yang tidak ada di DB
      delete dbUpdates.id; 
      delete dbUpdates.createdAt;

      const { error } = await supabase
        .from('facilities')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      fetchFacilities();
    } catch (error) {
      console.error('Error updating facility:', error);
    }
  };

  const deleteFacility = async (id: string) => {
    try {
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };


  // --- FUNGSI CRUD RESERVATIONS ---

  const addReservation = async (
    reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status'>, 
    onSuccess?: () => void
  ) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .insert([{
          user_id: reservationData.userId,
          facility_id: reservationData.facilityId,
          date: reservationData.date.toISOString().split('T')[0], // Format YYYY-MM-DD
          start_time: reservationData.startTime,
          end_time: reservationData.endTime,
          purpose: reservationData.purpose,
          status: 'pending'
        }]);

      if (error) throw error;
      
      fetchReservations(); // Refresh data
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding reservation:', error);
      alert('Gagal membuat reservasi: ' + (error as any).message);
    }
  };

  const updateReservationStatus = async (
    id: string, 
    status: ReservationStatus, 
    adminNote?: string, 
    onSuccess?: () => void
  ) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ 
          status: status,
          admin_note: adminNote
        })
        .eq('id', id);

      if (error) throw error;

      fetchReservations();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  // Helper filters (tetap dilakukan di sisi klien untuk performa UI yang cepat)
  const getUserReservations = (userId: string) => {
    return reservations.filter(r => r.userId === userId);
  };

  const getFacilityReservations = (facilityId: string) => {
    return reservations.filter(r => r.facilityId === facilityId);
  };

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