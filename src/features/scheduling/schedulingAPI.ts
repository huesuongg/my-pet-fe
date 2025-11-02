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
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch doctors");
    }
  },

  // Get doctor by ID
  getDoctorById: async (id: string): Promise<Doctor | null> => {
    try {
      const response = await axiosInstance.get(`/api/doctors/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching doctor:", error);
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || "Failed to fetch doctor");
    }
  },

  // Get appointments
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await axiosInstance.get("/api/appointments");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch appointments");
    }
  },

  // Create appointment
  createAppointment: async (appointment: Omit<Appointment, "id">): Promise<Appointment> => {
    try {
      const response = await axiosInstance.post("/api/appointments", appointment);
      return response.data;
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      throw new Error(error.response?.data?.message || "Failed to create appointment");
    }
  },

  // Update appointment
  updateAppointment: async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
    try {
      const response = await axiosInstance.patch(`/api/appointments/${id}`, updates);
      return response.data;
    } catch (error: any) {
      console.error("Error updating appointment:", error);
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || "Failed to update appointment");
    }
  },

  // Delete appointment
  deleteAppointment: async (appointmentId: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.delete(`/api/appointments/${appointmentId}`);
      return response.data?.success || true;
    } catch (error: any) {
      console.error("Error deleting appointment:", error);
      throw new Error(error.response?.data?.message || "Failed to delete appointment");
    }
  },
};
