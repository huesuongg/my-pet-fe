import { useState, useEffect } from 'react';
import { Doctor, Appointment } from '../types';
import { schedulingAPI } from '../schedulingAPI';

export const useScheduling = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load doctors
  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await schedulingAPI.getDoctors();
      setDoctors(data);
    } catch (err) {
      setError('Failed to load doctors');
      console.error('Error loading doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load appointments
  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await schedulingAPI.getAppointments();
      setAppointments(data);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get doctor by ID
  const getDoctorById = async (id: string): Promise<Doctor | null> => {
    try {
      setDoctorLoading(true);
      setError(null);
      const doctor = await schedulingAPI.getDoctorById(id);
      return doctor;
    } catch (err) {
      setError('Failed to load doctor details');
      console.error('Error loading doctor:', err);
      return null;
    } finally {
      setDoctorLoading(false);
    }
  };

  // Create appointment
  const createAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newAppointment = await schedulingAPI.createAppointment(appointment);
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      setError('Failed to create appointment');
      console.error('Error creating appointment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update appointment
  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAppointment = await schedulingAPI.updateAppointment(id, updates);
      if (updatedAppointment) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? updatedAppointment : apt)
        );
      }
      return updatedAppointment;
    } catch (err) {
      setError('Failed to update appointment');
      console.error('Error updating appointment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete appointment
  const deleteAppointment = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const success = await schedulingAPI.deleteAppointment(id);
      if (success) {
        setAppointments(prev => prev.filter(apt => apt.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete appointment');
      console.error('Error deleting appointment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get appointment by doctor ID
  const getAppointmentByDoctorId = (doctorId: string): Appointment | undefined => {
    return appointments.find(apt => apt.doctorId === doctorId);
  };

  // Load initial data
  useEffect(() => {
    console.log('useScheduling: Loading initial data');
    loadDoctors();
    loadAppointments();
  }, []);

  return {
    doctors,
    appointments,
    loading,
    doctorLoading,
    error,
    loadDoctors,
    loadAppointments,
    getDoctorById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentByDoctorId,
  };
};
