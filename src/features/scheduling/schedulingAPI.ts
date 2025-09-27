import { Doctor, Appointment } from "./types";

// Mock API functions for scheduling
export const schedulingAPI = {
  // Get all doctors
  getDoctors: async (): Promise<Doctor[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: "1",
        name: "Dr. Brain Adam",
        specialization: "Restoractive Dentist",
        profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
        experience: "25 năm kinh nghiệm",
        qualifications: ["MBBS", "MD", "MRCOG", "DFSRH"],
        skills: ["IVF", "IUI", "ICSI", "TESA", "PESA", "IMSI", "Blastocyte Culture", "Cryopreservation", "Laparoscopy", "Hysteroscopy"],
        biography: "Tiến sĩ Brain Adam là chuyên gia sinh sản được đào tạo quốc tế...",
        phone: "+123-456-7890",
        address: "03 Hoàng Văn Thụ, Phường Phước Ninh, Quận Hải Châu",
        city: "Thành phố Đà Nẵng",
        isActive: true,
      },
      {
        id: "2",
        name: "Dr. Sarah Johnson",
        specialization: "Veterinary Surgeon",
        profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        experience: "20 năm kinh nghiệm",
        qualifications: ["DVM", "MS", "Diplomate ACVS"],
        skills: ["Orthopedic Surgery", "Soft Tissue Surgery", "Emergency Medicine", "Dentistry", "Ophthalmology"],
        biography: "Dr. Sarah Johnson là bác sĩ phẫu thuật thú y có kinh nghiệm...",
        phone: "+123-456-7891",
        address: "123 Pet Care Street, District 1",
        city: "Ho Chi Minh City",
        isActive: true,
      },
      {
        id: "3",
        name: "Dr. Michael Chen",
        specialization: "Internal Medicine Specialist",
        profileImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
        experience: "15 năm kinh nghiệm",
        qualifications: ["DVM", "PhD", "Diplomate ACVIM"],
        skills: ["Cardiology", "Oncology", "Neurology", "Endocrinology", "Gastroenterology"],
        biography: "Dr. Michael Chen chuyên về nội khoa thú y...",
        phone: "+123-456-7892",
        address: "456 Animal Health Ave, District 3",
        city: "Ho Chi Minh City",
        isActive: true,
      },
      {
        id: "4",
        name: "Dr. Emily Davis",
        specialization: "Dermatology Specialist",
        profileImage: "https://images.unsplash.com/photo-1594824388852-8a7a4a4a8a7a?w=150&h=150&fit=crop&crop=face",
        experience: "12 năm kinh nghiệm",
        qualifications: ["DVM", "Diplomate ACVD"],
        skills: ["Allergy Management", "Skin Surgery", "Dermatopathology", "Immunotherapy"],
        biography: "Dr. Emily Davis là chuyên gia da liễu thú y...",
        phone: "+123-456-7893",
        address: "789 Skin Care Blvd, District 7",
        city: "Ho Chi Minh City",
        isActive: true,
      },
      {
        id: "5",
        name: "Dr. James Wilson",
        specialization: "Emergency Medicine",
        profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
        experience: "18 năm kinh nghiệm",
        qualifications: ["DVM", "Diplomate ACVECC"],
        skills: ["Trauma Surgery", "Critical Care", "Toxicology", "Emergency Diagnostics"],
        biography: "Dr. James Wilson chuyên về cấp cứu thú y...",
        phone: "+123-456-7894",
        address: "321 Emergency Lane, District 2",
        city: "Ho Chi Minh City",
        isActive: true,
      },
      {
        id: "6",
        name: "Dr. Lisa Anderson",
        specialization: "Behavioral Medicine",
        profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        experience: "10 năm kinh nghiệm",
        qualifications: ["DVM", "Diplomate ACVB"],
        skills: ["Behavioral Therapy", "Training", "Anxiety Management", "Aggression Treatment"],
        biography: "Dr. Lisa Anderson chuyên về hành vi thú y...",
        phone: "+123-456-7895",
        address: "654 Behavior Street, District 4",
        city: "Ho Chi Minh City",
        isActive: true,
      },
    ];
  },

  // Get doctor by ID
  getDoctorById: async (id: string): Promise<Doctor | null> => {
    console.log('API: Getting doctor by ID:', id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const doctors = await schedulingAPI.getDoctors();
    const doctor = doctors.find(doctor => doctor.id === id) || null;
    console.log('API: Found doctor:', doctor);
    return doctor;
  },

  // Get appointments
  getAppointments: async (): Promise<Appointment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: "1",
        doctorId: "1",
        date: "12 06 2025",
        type: "ECG",
        status: "active",
        phone: "+123-456-7890",
      },
      {
        id: "2",
        doctorId: "2",
        date: "15 06 2025",
        type: "Surgery",
        status: "active",
        phone: "+123-456-7891",
      },
      {
        id: "3",
        doctorId: "3",
        date: "18 06 2025",
        type: "Check-up",
        status: "active",
        phone: "+123-456-7892",
      },
      {
        id: "4",
        doctorId: "4",
        date: "20 06 2025",
        type: "Dermatology",
        status: "active",
        phone: "+123-456-7893",
      },
      {
        id: "5",
        doctorId: "5",
        date: "22 06 2025",
        type: "Emergency",
        status: "active",
        phone: "+123-456-7894",
      },
      {
        id: "6",
        doctorId: "6",
        date: "25 06 2025",
        type: "Behavior",
        status: "active",
        phone: "+123-456-7895",
      },
    ];
  },

  // Create appointment
  createAppointment: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    
    return newAppointment;
  },

  // Update appointment
  updateAppointment: async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock implementation - in real app, this would update the database
    const appointments = await schedulingAPI.getAppointments();
    const appointment = appointments.find(apt => apt.id === id);
    
    if (!appointment) return null;
    
    return { ...appointment, ...updates };
  },

  // Delete appointment
  deleteAppointment: async (appointmentId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock implementation - in real app, this would delete from database
    console.log('Deleting appointment:', appointmentId);
    return true;
  },
};
