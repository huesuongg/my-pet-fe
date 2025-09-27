export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  profileImage: string;
  experience: string;
  qualifications: string[];
  skills: string[];
  biography: string;
  phone: string;
  address: string;
  city: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  type: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  phone: string;
}

export interface DoctorCardProps {
  doctor: Doctor;
  appointment: Appointment;
  onSchedule?: () => void;
}

export interface ServiceDetailProps {
  doctor: Doctor;
  onSchedule: () => void;
  onClose?: () => void;
}

export interface SchedulesPageProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onViewMore: () => void;
  onDoctorSelect: (doctor: Doctor) => void;
}
