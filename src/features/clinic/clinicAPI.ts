import { Clinic } from "./types";
import axiosInstance from "../../services/axiosInstance";

export const clinicAPI = {
  // Get all clinics
  getClinics: async (): Promise<Clinic[]> => {
    try {
      const response = await axiosInstance.get("/api/clinics");
      return response.data.items || [];
    } catch (error: unknown) {
      console.error("Error fetching clinics:", error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to fetch clinics"
        : "Failed to fetch clinics";
      throw new Error(errorMessage);
    }
  },

  // Get clinic by ID
  getClinicById: async (id: string): Promise<Clinic | null> => {
    try {
      const response = await axiosInstance.get(`/api/clinics/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching clinic:", error);
      const axiosError = error && typeof error === 'object' && 'response' in error
        ? error as { response?: { status?: number; data?: { message?: string } } }
        : null;
      if (axiosError?.response?.status === 404) {
        return null;
      }
      const errorMessage = axiosError?.response?.data?.message || "Failed to fetch clinic";
      throw new Error(errorMessage);
    }
  },
};



