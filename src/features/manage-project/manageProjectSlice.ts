import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ProjectService from "./manageProjectThunk"; 
import { DEFAULT_ERROR_MESSAGE } from "./constants/errorMessages";
import { ProjectState } from "./types/project.state";


const initialState: ProjectState = {
  projects: [],
  status: {
    fetch: "idle",
    delete: "idle",
    save: "idle",
    active: "idle",
    detail: "idle",
  },
  error: null,
  curentProject: null,
  statistic: {
    tasks:  null,
    team: null,
  }
};

type StatusKey = keyof ProjectState["status"];

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearStatus: (state, action: PayloadAction<StatusKey>) => {
      state.status[action.payload] = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(ProjectService.fetchProject.pending, (state) => {
        state.status.fetch = "loading";
        state.error = null;
      })
      .addCase(ProjectService.fetchProject.fulfilled, (state, action) => {
        state.status.fetch = "success";
        state.projects = action.payload;
      })
      .addCase(ProjectService.fetchProject.rejected, (state, action) => {
        state.status.fetch = "error";
        state.error = `${action.payload?.message ?? DEFAULT_ERROR_MESSAGE}`;
      })

      //delete project
      .addCase(ProjectService.deleteProject.pending, (state) => {
        state.status.delete = "loading";
        state.error = null;
      })
      .addCase(ProjectService.deleteProject.fulfilled, (state, action) => {
        state.status.delete = "success";
        state.error = null;
        const deletedId = action.meta.arg;
        state.projects = state.projects.filter(project => project.id !== deletedId);
      })
      .addCase(ProjectService.deleteProject.rejected, (state, action) => {
        state.status.delete = "error";
        state.error = `${action.payload?.message ?? DEFAULT_ERROR_MESSAGE}`;
      })

      //activate project
      .addCase(ProjectService.activateProject.pending, (state) => {
        state.status.active = "loading";
        state.error = null;
      })
      .addCase(ProjectService.activateProject.fulfilled, (state) => {
        state.status.active = "success";
        state.error = null;
      })
      .addCase(ProjectService.activateProject.rejected, (state, action) => {
        state.status.active = "error";
        state.error = `${action.payload?.message ?? DEFAULT_ERROR_MESSAGE}`;
      })

      //get project detail
      .addCase(ProjectService.getProjectDetail.pending, (state) => {
        state.status.detail = "loading";
        state.error = null;
      })
      .addCase(ProjectService.getProjectDetail.fulfilled, (state, action) => {
        state.status.detail = "success";
        state.error = null;
        state.curentProject = action.payload;
      })
      .addCase(ProjectService.getProjectDetail.rejected, (state, action) => {
        state.status.detail = "error";
        state.error = `${action.payload?.message ?? DEFAULT_ERROR_MESSAGE}`;
      })
      
      //get project statistic 
      .addCase(ProjectService.getTimesheetStatistic.pending, (state) => {
        state.status.detail = "loading";
        state.error = null;
      })
      .addCase(ProjectService.getTimesheetStatistic.fulfilled, (state, action) => {
        state.status.detail = "success";
        state.error = null;
        if (state.statistic) {
          state.statistic.tasks = action.payload.tasks;
          state.statistic.team = action.payload.team;
        }
      })
      .addCase(ProjectService.getTimesheetStatistic.rejected, (state, action) => {
        state.status.detail = "error";
        state.error = `${action.payload?.message ?? DEFAULT_ERROR_MESSAGE}`;
      })

      //save project
      .addCase(ProjectService.saveProject.pending, (state) => {
        state.status.save = "loading";
        state.error = null;
      })
      .addCase(ProjectService.saveProject.fulfilled, (state, action) => {
        state.status.save = "success";
        state.error = null;
        state.curentProject = action.payload;
      })
      .addCase(ProjectService.saveProject.rejected, (state, action) => {
        state.status.save = "error";
        state.error = `${action.payload?.message ?? DEFAULT_ERROR_MESSAGE}`;
      });
  },
});

export const { clearError, clearStatus } = projectSlice.actions;
export default projectSlice.reducer;
