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
         biography: "Tiến sĩ Brain Adam là chuyên gia sinh sản được đào tạo quốc tế với hơn 25 năm kinh nghiệm trong lĩnh vực hỗ trợ sinh sản. Ông đã thực hiện thành công hàng nghìn ca IVF và được công nhận là một trong những chuyên gia hàng đầu trong lĩnh vực này.",
         phone: "+123-456-7890",
         address: "03 Hoàng Văn Thụ, Phường Phước Ninh, Quận Hải Châu",
         city: "Thành phố Đà Nẵng",
         isActive: true,
        availableSlots: (() => {
          const slots = [];
          const today = new Date();
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            slots.push(
              { date: dateStr, time: "09:00", available: true },
              { date: dateStr, time: "10:00", available: true },
              { date: dateStr, time: "14:00", available: true }
            );
          }
          return slots;
        })()
       },
      {
        id: "2",
        name: "Dr. Sarah Johnson",
        specialization: "Veterinary Surgeon",
        profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        experience: "20 năm kinh nghiệm",
        qualifications: ["DVM", "MS", "Diplomate ACVS"],
        skills: ["Orthopedic Surgery", "Soft Tissue Surgery", "Emergency Medicine", "Dentistry", "Ophthalmology"],
        biography: "Dr. Sarah Johnson là bác sĩ phẫu thuật thú y có kinh nghiệm hơn 20 năm trong việc điều trị các bệnh lý phức tạp ở động vật. Bà chuyên về phẫu thuật chỉnh hình và phẫu thuật mô mềm.",
        phone: "+123-456-7891",
        address: "123 Pet Care Street, District 1",
        city: "Ho Chi Minh City",
        isActive: true,
        availableSlots: (() => {
          const slots = [];
          const today = new Date();
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            slots.push(
              { date: dateStr, time: "08:00", available: true },
              { date: dateStr, time: "13:00", available: true }
            );
          }
          return slots;
        })()
      },
      {
        id: "3",
        name: "Dr. Michael Chen",
        specialization: "Internal Medicine Specialist",
        profileImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
        experience: "15 năm kinh nghiệm",
        qualifications: ["DVM", "PhD", "Diplomate ACVIM"],
        skills: ["Cardiology", "Oncology", "Neurology", "Endocrinology", "Gastroenterology"],
        biography: "Dr. Michael Chen chuyên về nội khoa thú y với kinh nghiệm 15 năm trong chẩn đoán và điều trị các bệnh lý nội khoa phức tạp ở động vật.",
        phone: "+123-456-7892",
        address: "456 Animal Health Ave, District 3",
        city: "Ho Chi Minh City",
        isActive: true,
        availableSlots: (() => {
          const slots = [];
          const today = new Date();
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            slots.push(
              { date: dateStr, time: "10:00", available: true },
              { date: dateStr, time: "15:00", available: true }
            );
          }
          return slots;
        })()
      },
      {
        id: "4",
        name: "Dr. Emily Davis",
        specialization: "Dermatology Specialist",
        profileImage: "https://images.unsplash.com/photo-1594824388852-8a7a4a4a8a7a?w=150&h=150&fit=crop&crop=face",
        experience: "12 năm kinh nghiệm",
        qualifications: ["DVM", "Diplomate ACVD"],
        skills: ["Allergy Management", "Skin Surgery", "Dermatopathology", "Immunotherapy"],
        biography: "Dr. Emily Davis là chuyên gia da liễu thú y với kinh nghiệm 12 năm trong chẩn đoán và điều trị các bệnh lý da liễu phức tạp ở động vật.",
        phone: "+123-456-7893",
        address: "789 Skin Care Blvd, District 7",
        city: "Ho Chi Minh City",
        isActive: true,
        availableSlots: (() => {
          const slots = [];
          const today = new Date();
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            slots.push(
              { date: dateStr, time: "09:00", available: true },
              { date: dateStr, time: "14:00", available: true }
            );
          }
          return slots;
        })()
      },
      {
        id: "5",
        name: "Dr. James Wilson",
        specialization: "Emergency Medicine",
        profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
        experience: "18 năm kinh nghiệm",
        qualifications: ["DVM", "Diplomate ACVECC"],
        skills: ["Trauma Surgery", "Critical Care", "Toxicology", "Emergency Diagnostics"],
        biography: "Dr. James Wilson chuyên về cấp cứu thú y với kinh nghiệm 18 năm trong xử lý các ca cấp cứu và phẫu thuật khẩn cấp.",
        phone: "+123-456-7894",
        address: "321 Emergency Lane, District 2",
        city: "Ho Chi Minh City",
        isActive: true,
        availableSlots: (() => {
          const slots = [];
          const today = new Date();
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            slots.push(
              { date: dateStr, time: "08:00", available: true },
              { date: dateStr, time: "16:00", available: true }
            );
          }
          return slots;
        })()
      },
      {
        id: "6",
        name: "Dr. Lisa Anderson",
        specialization: "Behavioral Medicine",
        profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        experience: "10 năm kinh nghiệm",
        qualifications: ["DVM", "Diplomate ACVB"],
        skills: ["Behavioral Therapy", "Training", "Anxiety Management", "Aggression Treatment"],
        biography: "Dr. Lisa Anderson chuyên về hành vi thú y với kinh nghiệm 10 năm trong điều trị các vấn đề hành vi và tâm lý ở động vật.",
        phone: "+123-456-7895",
        address: "654 Behavior Street, District 4",
        city: "Ho Chi Minh City",
        isActive: true,
        availableSlots: (() => {
          const slots = [];
          const today = new Date();
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            slots.push(
              { date: dateStr, time: "10:00", available: true },
              { date: dateStr, time: "15:00", available: true }
            );
          }
          return slots;
        })()
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
         date: "2024-01-15",
         time: "09:00",
         type: "Khám tổng quát",
         status: "active",
         phone: "+123-456-7890",
         patientName: "John Doe",
         patientPhone: "+123-456-7890",
         notes: "Regular checkup",
         paymentMethod: "cash"
       },
       {
         id: "2",
         doctorId: "2",
         date: "2024-01-16",
         time: "14:00",
         type: "Phẫu thuật",
         status: "active",
         phone: "+123-456-7891",
         patientName: "Jane Smith",
         patientPhone: "+123-456-7891",
         notes: "Spay surgery",
         paymentMethod: "cash"
       },
       {
         id: "3",
         doctorId: "3",
         date: "2024-01-17",
         time: "09:00",
         type: "Khám tổng quát",
         status: "pending",
         phone: "+123-456-7892",
         patientName: "Mike Johnson",
         patientPhone: "+123-456-7892",
         notes: "Follow-up appointment",
         paymentMethod: "cash"
       },
       {
         id: "4",
         doctorId: "4",
         date: "2024-01-18",
         time: "10:00",
         type: "Khám da liễu",
         status: "completed",
         phone: "+123-456-7893",
         patientName: "Sarah Wilson",
         patientPhone: "+123-456-7893",
         notes: "Skin allergy check",
         paymentMethod: "cash"
       },
       {
         id: "5",
         doctorId: "5",
         date: "2024-01-17",
         time: "08:00",
         type: "Cấp cứu",
         status: "cancelled",
         phone: "+123-456-7894",
         patientName: "Emergency Case",
         patientPhone: "+123-456-7894",
         notes: "Emergency consultation",
         paymentMethod: "cash"
       },
       {
         id: "6",
         doctorId: "6",
         date: "2024-01-19",
         time: "09:00",
         type: "Tư vấn dinh dưỡng",
         status: "confirmed",
         phone: "+123-456-7895",
         patientName: "Lisa Brown",
         patientPhone: "+123-456-7895",
         notes: "Nutrition consultation",
         paymentMethod: "cash"
       },
     ];
  },

  // Create appointment
  createAppointment: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      paymentMethod: appointment.paymentMethod || 'cash',
    };
    
    // Add to mock data
    const appointments = await schedulingAPI.getAppointments();
    appointments.push(newAppointment);
    
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
