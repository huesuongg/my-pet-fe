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
