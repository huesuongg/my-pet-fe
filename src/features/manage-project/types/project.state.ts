import { RequestStatus } from "../../../types";
import ProjectCardType, { ProjectDetail, ProjectStatisticTask, ProjectStatisticUser } from "./project.model";

export interface ProjectState {
    projects: ProjectCardType[];
    status: {
      fetch?: RequestStatus;
      delete?: RequestStatus;
      save?: RequestStatus;
      active?: RequestStatus;
      detail?: RequestStatus;
    };
    error: string | null;
    curentProject?: ProjectDetail | null;
    statistic?: {
      tasks?: ProjectStatisticTask[] | null;
      team?: ProjectStatisticUser[] | null;
    }
  }