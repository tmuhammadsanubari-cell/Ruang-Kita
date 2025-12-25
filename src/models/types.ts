// Models - Data Types and Interfaces

export type UserRole = 'user' | 'admin';

export type ReservationStatus = 'pending' | 'approved' | 'rejected';

export type FacilityStatus = 'available' | 'unavailable' | 'maintenance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Facility {
  id: string;
  name: string;
  capacity: number;
  location: string;
  status: FacilityStatus;
  description: string;
  image: string;
  features: string[];
  createdAt: Date;
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  facilityId: string;
  facilityName: string;
  date: Date;
  startTime: string;
  endTime: string;
  purpose: string;
  status: ReservationStatus;
  createdAt: Date;
  adminNote?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
