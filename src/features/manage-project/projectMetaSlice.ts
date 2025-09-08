import { RequestStatus } from "../../types";
import { BranchFilterType } from "../../types/branch/branch.model";
import { CustomerType } from "../../types/customer/customer.model";
import { TaskType } from "../../types/task/task.model";
import { UserType } from "../../types/user/user.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ProjectService from './manageProjectThunk';

export interface ProjectMetaState {
  users: UserType[];
  tasks: TaskType[];
  branches: BranchFilterType[];
  customers: CustomerType[];
  currentCustomer?: CustomerType | null;
  status: {
    fetchProjectMeta: RequestStatus;
    saveCustomer: RequestStatus;
  };
  error: string | null;
}
const initialState: ProjectMetaState = {
  users: [],
  tasks: [],
  branches: [],
  customers: [],
  currentCustomer: null,
  status: {
    fetchProjectMeta: "idle",
    saveCustomer: "idle",
  },
  error: null,
};

type StatusKey = keyof ProjectMetaState["status"];

const projectMetaSlice = createSlice({
  name: "projectMeta",
  initialState,
  reducers: {
    clearMetadataError: (state) => {
      state.error = null;
    },
    clearMetadataStatus: (state, action: PayloadAction<StatusKey>) => {
      state.status = {
        fetchProjectMeta: action.payload === "fetchProjectMeta" ? "idle" : state.status.fetchProjectMeta,
        saveCustomer: action.payload === "saveCustomer" ? "idle" : state.status.saveCustomer
      };
    }
  },
  extraReducers: (builder) => {
    builder
      //fetch project meta
      .addCase(ProjectService.fetchProjectMeta.pending, (state) => {
        state.status.fetchProjectMeta = "loading";
        state.error = null;
      })
      .addCase(ProjectService.fetchProjectMeta.fulfilled, (state, action) => {
        state.status.fetchProjectMeta = "success";
        state.error = null;
        state.tasks = action.payload.tasks;
        state.users = action.payload.team;
        state.branches = action.payload.branches;
        state.customers = action.payload.customers;
      })
      .addCase(ProjectService.fetchProjectMeta.rejected, (state, action) => {
        state.status.fetchProjectMeta = "error";
        state.error = `${action.payload?.message ?? "Error unknown. Check your internet connection."}`;
      })

      //save customer
      .addCase(ProjectService.saveCustomer.pending, (state) => {
        state.status.saveCustomer = "loading";
        state.error = null;
      })
      .addCase(ProjectService.saveCustomer.fulfilled, (state, action) => {
        state.status.saveCustomer = "success";
        state.error = null;
        state.customers = [...state.customers, action.payload];
        state.currentCustomer = action.payload;
      })
      .addCase(ProjectService.saveCustomer.rejected, (state, action) => {
        state.status.saveCustomer = "error";
        state.error = `${action.payload?.message ?? "Error unknown. Check your internet connection."}`;
      });
  },
});

export const { clearMetadataError, clearMetadataStatus } = projectMetaSlice.actions;
export default projectMetaSlice.reducer;

