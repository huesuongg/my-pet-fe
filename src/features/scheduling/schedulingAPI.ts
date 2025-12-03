import { Doctor, Appointment } from "./types";
import axiosInstance from "../../services/axiosInstance";

// API functions for scheduling - gọi API backend
export const schedulingAPI = {
  // Get all doctors
  getDoctors: async (includeSlots: boolean = false): Promise<Doctor[]> => {
    try {
      const response = await axiosInstance.get("/api/doctors", {
        params: includeSlots ? { includeSlots: "true" } : {},
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching doctors:", error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to fetch doctors"
        : "Failed to fetch doctors";
      throw new Error(errorMessage);
    }
  },

  // Get doctor by ID
  getDoctorById: async (id: string): Promise<Doctor | null> => {
    try {
      const response = await axiosInstance.get(`/api/doctors/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching doctor:", error);
      const axiosError = error && typeof error === 'object' && 'response' in error
        ? error as { response?: { status?: number; data?: { message?: string } } }
        : null;
      if (axiosError?.response?.status === 404) {
        return null;
      }
      const errorMessage = axiosError?.response?.data?.message || "Failed to fetch doctor";
      throw new Error(errorMessage);
    }
  },

  // Get appointments
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await axiosInstance.get("/api/appointments");
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching appointments:", error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to fetch appointments"
        : "Failed to fetch appointments";
      throw new Error(errorMessage);
    }
  },

  // Get all appointments (Admin only) - with pagination
  // Uses GET /api/appointments with query params for filtering
  getAllAppointments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    doctorId?: string;
  }): Promise<{
    appointments: Appointment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    try {
      const response = await axiosInstance.get("/api/appointments", {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          status: params?.status,
          doctorId: params?.doctorId,
        },
      });
      
      // Handle both array response and paginated response
      if (Array.isArray(response.data)) {
        return {
          appointments: response.data,
          total: response.data.length,
          page: 1,
          limit: response.data.length,
          totalPages: 1,
        };
      }
      
      // Paginated response
      return {
        appointments: response.data.appointments || response.data.items || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / (response.data.limit || 10)),
      };
    } catch (error: unknown) {
      console.error("Error fetching all appointments:", error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to fetch appointments"
        : "Failed to fetch appointments";
      throw new Error(errorMessage);
    }
  },

  // Create appointment
  createAppointment: async (appointment: Omit<Appointment, "id">): Promise<Appointment> => {
    try {
      const response = await axiosInstance.post("/api/appointments", appointment);
      return response.data;
    } catch (error: unknown) {
      console.error("Error creating appointment:", error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to create appointment"
        : "Failed to create appointment";
      throw new Error(errorMessage);
    }
  },

  // Update appointment
  updateAppointment: async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
    try {
      const response = await axiosInstance.patch(`/api/appointments/${id}`, updates);
      return response.data;
    } catch (error: unknown) {
      console.error("Error updating appointment:", error);
      const axiosError = error && typeof error === 'object' && 'response' in error
        ? error as { response?: { status?: number; data?: { message?: string } } }
        : null;
      if (axiosError?.response?.status === 404) {
        return null;
      }
      const errorMessage = axiosError?.response?.data?.message || "Failed to update appointment";
      throw new Error(errorMessage);
    }
  },

  // Update appointment status (using /:id/status endpoint)
  updateAppointmentStatus: async (id: string, status: string): Promise<Appointment | null> => {
    try {
      const response = await axiosInstance.patch(`/api/appointments/${id}/status`, { status });
      return response.data;
    } catch (error: unknown) {
      console.error("Error updating appointment status:", error);
      const axiosError = error && typeof error === 'object' && 'response' in error
        ? error as { response?: { status?: number; data?: { message?: string } } }
        : null;
      if (axiosError?.response?.status === 404) {
        return null;
      }
      const errorMessage = axiosError?.response?.data?.message || "Failed to update appointment status";
      throw new Error(errorMessage);
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<Appointment | null> => {
    try {
      const response = await axiosInstance.get(`/api/appointments/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching appointment by ID:", error);
      const axiosError = error && typeof error === 'object' && 'response' in error
        ? error as { response?: { status?: number; data?: { message?: string } } }
        : null;
      if (axiosError?.response?.status === 404) {
        return null;
      }
      const errorMessage = axiosError?.response?.data?.message || "Failed to fetch appointment";
      throw new Error(errorMessage);
    }
  },

  // Delete appointment
  deleteAppointment: async (appointmentId: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.delete(`/api/appointments/${appointmentId}`);
      return response.data?.success || true;
    } catch (error: unknown) {
      console.error("Error deleting appointment:", error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete appointment"
        : "Failed to delete appointment";
      throw new Error(errorMessage);
    }
  },
};
