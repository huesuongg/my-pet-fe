import { RejectPayload } from '../../types';
import ProjectAPI from "./manageProjectAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import ProjectCardType, { ProjectDetail, ProjectStatisticTask, ProjectStatisticUser } from "./types/project.model";
import FetchProjectPayload, { CustomerPayload, GetTimesheetStatisticPayload } from './types/project.dto';
import { APIErrorResponse } from '../../types';
import { TaskType } from '../../types/task/task.model';
import { UserType } from '../../types/user/user.model';
import { BranchFilterType } from '../../types/branch/branch.model';
import { CustomerType } from '../../types/customer/customer.model';
import { ProjectDetailPayload } from './types/project.dto';

export const fetchProject = createAsyncThunk<
  ProjectCardType[], 
  FetchProjectPayload|undefined,
  { rejectValue: RejectPayload }>(
    "projects/fetchProject",
    async (data, { rejectWithValue }) => {
      try {
        const res = await ProjectAPI.fetchProjectsAPI(data);
        return res.data.result; 
      } catch (err) {
        const error = err as AxiosError;
        const apiError = error.response?.data as APIErrorResponse;
        return rejectWithValue({
          status: error.response?.status,
          message: apiError?.error?.message,
        });
      }
    }
  );

  
export const deleteProject = createAsyncThunk<
  boolean, 
  number,
  { rejectValue: RejectPayload }>(
    "projects/deleteProject",
    async (id, { rejectWithValue }) => {
      try {
        const res = await ProjectAPI.deleteProjectAPI(id);
        return res.data.success; 
      } catch (err) {
        const error = err as AxiosError;
        const apiError = error.response?.data as APIErrorResponse;
        return rejectWithValue({
          status: error.response?.status,
          message: apiError?.error?.message,
        });
      }
    }
  );


export const activateProject = createAsyncThunk<
  boolean, 
  ProjectCardType,
  { rejectValue: RejectPayload }>(
    "projects/activateProject",
    async (project, { rejectWithValue }) => {
      try {
        const res = project.status 
          ? await ProjectAPI.deactivateProjectAPI(project.id) 
          : await ProjectAPI.activateProjectAPI(project.id);
        return res.data.success; 
      } catch (err) {
        const error = err as AxiosError;
        const apiError = error.response?.data as APIErrorResponse;
        return rejectWithValue({
          status: error.response?.status,
          message: apiError?.error?.message,
        });
      }
    }
  );

export const getProjectDetail = createAsyncThunk<
  ProjectDetail, 
  number,
  { rejectValue: RejectPayload }>(
    "projects/getProjectDetail",
    async (id, { rejectWithValue }) => {
      try {
        const res = await ProjectAPI.fetchProjectDetailAPI(id);
        return res.data.result; 
      } catch (err) {
        const error = err as AxiosError;
        const apiError = error.response?.data as APIErrorResponse;
        return rejectWithValue({
          status: error.response?.status,
          message: apiError?.error?.message,
        });
      }
    }
  );

export const getTimesheetStatistic = createAsyncThunk<
  { tasks: ProjectStatisticTask[]; team: ProjectStatisticUser[] }, 
  GetTimesheetStatisticPayload,
  { rejectValue: RejectPayload }
>(
  "projects/getStatisticAll",
  async (data, { rejectWithValue }) => {
    try {
      const [taskRes, teamRes] = await Promise.all([
        ProjectAPI.getTimesheetStatisticTaskAPI(data),
        ProjectAPI.getTimesheetStatisticTeamAPI(data),
      ]);
      return {
        tasks: taskRes.data.result,
        team: teamRes.data.result,
      };
    } catch (err) {
      const error = err as AxiosError;
      const apiError = error.response?.data as APIErrorResponse;
      return rejectWithValue({
        status: error.response?.status,
        message: apiError?.error?.message ?? "Unknown error",
      });
    }
  }
);

export const fetchProjectMeta = createAsyncThunk<
  { tasks: TaskType[]; team: UserType[];
    branches: BranchFilterType[]; customers: CustomerType[];
   }, 
  void,
  { rejectValue: RejectPayload }
>(
  "projects/fetchProjectMeta",
  async (_data, { rejectWithValue }) => {
    try {
      const [taskRes, teamRes, branchRes, customerRes] = await Promise.all([
        ProjectAPI.getAllTaskAPI(),
        ProjectAPI.getAllUserNotPaggingAPI(),
        ProjectAPI.getAllBranchFilterAPI(),
        ProjectAPI.getAllCustomerAPI(),
      ]);
      return {
        tasks: taskRes.data.result,
        team: teamRes.data.result,
        branches: branchRes.data.result,
        customers: customerRes.data.result,
      };
    } catch (err) {
      const error = err as AxiosError;
      const apiError = error.response?.data as APIErrorResponse;
      return rejectWithValue({
        status: error.response?.status,
        message: apiError?.error?.message ?? "Unknown error",
      });
    }
  }
);

export const saveProject = createAsyncThunk<
  ProjectDetail, 
  ProjectDetailPayload,
  { rejectValue: RejectPayload }>(
    "projects/createProject",
    async (data, { rejectWithValue }) => {
      try {
        const res = await ProjectAPI.createProjectAPI(data);
        return res.data.success; 
      } catch (err) {
        const error = err as AxiosError;
        const apiError = error.response?.data as APIErrorResponse;
        return rejectWithValue({
          status: error.response?.status,
          message: apiError?.error?.message,
        });
      }
    }
  );

export const saveCustomer = createAsyncThunk<
  CustomerType,
  CustomerPayload,
  { rejectValue: RejectPayload }
>(
  "projects/saveCustomer",
  async (data, { rejectWithValue }) => {
    try {
      const res = await ProjectAPI.saveCustomerAPI(data);
      return res.data.result;
    } catch (err) {
      const error = err as AxiosError;
      const apiError = error.response?.data as APIErrorResponse;
      return rejectWithValue({
        status: error.response?.status,
        message: apiError?.error?.message,
      });
    }
  }
);


export default {fetchProject, deleteProject, activateProject, getProjectDetail,
  getTimesheetStatistic, fetchProjectMeta, saveProject, saveCustomer
};


