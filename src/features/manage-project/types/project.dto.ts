import { ProjectDetail } from "./project.model";

export interface FetchProjectPayload {
  status?: 0 | 1;
  search?: string;
}

export interface GetTimesheetStatisticPayload {
  projectId: number,
  startDate?: string //ISO format;
  endDate?: string;
}


export interface ProjectDetailPayload {
  id?: number;
  name: string;
  code: string;
  status?: number;
  timeStart: string; // ISO format
  timeEnd?: string; // ISO format
  note?: string;
  projectType: number;
  customerId: number;
  komuChannelId?: string;
  isNotifyToKomu?: boolean;
  isNoticeKMSubmitTS?: boolean;
  isNoticeKMRequestOffDate?: boolean;
  isNoticeKMApproveRequestOffDate?: boolean;
  isNoticeKMRequestChangeWorkingTime?: boolean;
  isNoticeKMApproveChangeWorkingTime?: boolean;
  isAllUserBelongTo?: boolean;

  tasks: ProjectTaskAssignment[];
  users: ProjectUserAssignment[];
  projectTargetUsers?: TargetUserAssignment[]; 
}

interface TargetUserAssignment {
  userId: number;
  roleName: string;
  id?: number;
}

interface ProjectTaskAssignment {
  id?: number;       
  taskId: number;
  billable: boolean;
}

export interface ProjectUserAssignment {
  id?: number;       
  userId: number;
  type: number;     
  isTemp: boolean;
}

export const convertToPayload = (data: ProjectDetail): ProjectDetailPayload => ({
  id: data.id,
  name: data.name,
  code: data.code,
  status: data.status,
  timeStart: data.timeStart,
  timeEnd: data.timeEnd,
  note: data.note,
  projectType: data.projectType,
  customerId: data.customerId,
  komuChannelId: data.komuChannelId,
  isNotifyToKomu: data.isNotifyToKomu,
  isNoticeKMSubmitTS: data.isNoticeKMSubmitTS,
  isNoticeKMRequestOffDate: data.isNoticeKMRequestOffDate,
  isNoticeKMApproveRequestOffDate: data.isNoticeKMApproveRequestOffDate,
  isNoticeKMRequestChangeWorkingTime: data.isNoticeKMRequestChangeWorkingTime,
  isNoticeKMApproveChangeWorkingTime: data.isNoticeKMApproveChangeWorkingTime,
  isAllUserBelongTo: data.isAllUserBelongTo,
  tasks: data.tasks,
  users: data.users,
  projectTargetUsers: data.projectTargetUsers
});

export interface CustomerPayload {
  name: string;
  code: string;
  address?: string;
}


export default FetchProjectPayload;