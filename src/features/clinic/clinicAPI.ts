import { Clinic } from "./types";
import axiosInstance from "../../services/axiosInstance";

export const clinicAPI = {
  // Get all clinics
  getClinics: async (): Promise<Clinic[]> => {
    try {
      const response = await axiosInstance.get("/api/clinics");
      return response.data.items || [];
    } catch (error: any) {
      console.error("Error fetching clinics:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch clinics");
    }
  },

  // Get clinic by ID
  getClinicById: async (id: string): Promise<Clinic | null> => {
    try {
      const response = await axiosInstance.get(`/api/clinics/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching clinic:", error);
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || "Failed to fetch clinic");
    }
  },
};



