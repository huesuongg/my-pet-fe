export interface WorkingHours {
  daysOfWeek: number[]; // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7
  startTime: string; // Format HH:mm
  endTime: string; // Format HH:mm
  is24Hours: boolean;
  emergency24h: boolean;
}

export interface Clinic {
  _id: string;
  name: string;
  address: string;
  phone: string;
  imgUrl: string;
  workingHours: WorkingHours[];
  technologyServices: string;
  ownerId: {
    _id: string;
    name?: string;
    email?: string;
  };
  timeZone: string;
  cancelBeforeMinutes: number;
  noShowMarkAfterMinutes: number;
  createdAt: string;
  updatedAt: string;
  doctors?: Array<{
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    specialization?: string;
    [key: string]: unknown;
  }>; // Danh sách bác sĩ (chỉ có trong detail) - sử dụng Doctor từ scheduling/types
}

