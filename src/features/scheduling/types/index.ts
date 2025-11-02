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
  availableSlots?: Array<{
    date: string;
    time: string;
    available: boolean;
  }>;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctor?: Doctor; // Thông tin bác sĩ (nếu có)
  date: string;
  time: string;
  type: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'confirmed';
  phone: string;
  patientName?: string;
  patientPhone?: string;
  notes?: string;
  paymentMethod?: string;
  clinicId?: string;
  petId?: string;
}

export interface DoctorCardProps {
  doctor: Doctor;
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
