import axiosInstance from "../../services/axiosInstance";
import FetchProjectPayload, { GetTimesheetStatisticPayload } from "./types/project.dto";
import { ProjectDetailPayload, CustomerPayload } from "./types/project.dto";


export const fetchProjectsAPI = (data?: FetchProjectPayload) => {
  return axiosInstance.get(`/services/app/Project/getAll?status=${data?.status?.toString()?data.status: ''}&search=${data?.search?data.search: ''}`, {
    withCredentials: true
  });
};


export const deleteProjectAPI = (id: number) => {
  return axiosInstance.delete(`services/app/Project/Delete?Id=${id}`);
};

export const activateProjectAPI = (id: number) => {
  return axiosInstance.post(`services/app/Project/Inactive`,{
    id: id,
  }, {
    withCredentials: true
  });
};

export const deactivateProjectAPI = (id: number) => {
  return axiosInstance.post(`services/app/Project/Active`,{
    id: id,
  }, {
    withCredentials: true
  });
};

export const fetchProjectDetailAPI = (id: number) => {
  return axiosInstance.get(`services/app/Project/Get?input=${id}`);
};

export const getTimesheetStatisticTaskAPI = ({projectId, startDate, endDate}: GetTimesheetStatisticPayload) => {
  return axiosInstance.get(`services/app/TimeSheetProject/GetTimeSheetStatisticTasks?projectId=${projectId}&startDate=${startDate}&endDate=${endDate}`);
};
export const getTimesheetStatisticTeamAPI = ({projectId, startDate, endDate}: GetTimesheetStatisticPayload) => {
  return axiosInstance.get(`services/app/TimeSheetProject/GetTimeSheetStatisticTeams?projectId=${projectId}&startDate=${startDate}&endDate=${endDate}`);
};

export const getAllTaskAPI = () => {
  return axiosInstance.get(`services/app/Task/GetAll`);
};

export const getAllUserNotPaggingAPI = () => {
  return axiosInstance.get(`services/app/User/GetUserNotPagging`);
};

export const getAllBranchFilterAPI = () => {
  return axiosInstance.get(`services/app/Branch/GetAllBranchFilter?isAll=true`);
};

export const getAllCustomerAPI = () => {
  return axiosInstance.get(`services/app/Customer/GetAll`);
};

export const createProjectAPI = (data: ProjectDetailPayload) => {
  return axiosInstance.post(`services/app/Project/Save`,data, {
    withCredentials: true
  });
};

export const saveCustomerAPI = (data: CustomerPayload) => {
  return axiosInstance.post(`services/app/Customer/Save`,data, {
    withCredentials: true
  });
};

export default {fetchProjectsAPI, deleteProjectAPI, activateProjectAPI, 
  deactivateProjectAPI, fetchProjectDetailAPI, getTimesheetStatisticTaskAPI,
  getTimesheetStatisticTeamAPI, getAllTaskAPI, getAllBranchFilterAPI, getAllUserNotPaggingAPI,
  getAllCustomerAPI, createProjectAPI, saveCustomerAPI
};

