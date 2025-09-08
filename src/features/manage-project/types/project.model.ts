export interface ProjectCardType {
  customerName: string;
  name: string;
  code: string;
  status: number;
  pms: string[];
  activeMember: number;
  projectType: number;
  timeStart: string; // ISO date string
  timeEnd: string | null;   
  id: number;
}

export interface ProjectStatisticTask {
  taskId: number;
  taskName: string;
  totalWorkingTime: number;
  billableWorkingTime: number;
  billable: boolean;
}

export interface ProjectStatisticUser {
  userID: number;
  userName: string;
  projectUserType: number;
  totalWorkingTime: number;
  billableWorkingTime: number;
}


export interface ProjectDetail {
  id: number;
  name: string;
  code: string;
  status: number;
  timeStart: string; // ISO format
  timeEnd: string; // ISO format
  note: string;
  projectType: ProjectType;
  customerId: number;
  komuChannelId: string;
  isNotifyToKomu: boolean;
  isNoticeKMSubmitTS: boolean;
  isNoticeKMRequestOffDate: boolean;
  isNoticeKMApproveRequestOffDate: boolean;
  isNoticeKMRequestChangeWorkingTime: boolean;
  isNoticeKMApproveChangeWorkingTime: boolean;
  isAllUserBelongTo: boolean;

  tasks: ProjectTaskAssignment[];
  users: ProjectUserAssignment[];
  projectTargetUsers: TargetUserAssignment[]; 
}

export enum ProjectType {
  TM = 0,          // T&M
  FixedPrice = 1,  // Fixed Price
  NonBill = 2,     // Non-Bill
  ODC = 3,         // ODC
  Product = 4,     // Product
  Training = 5,    // Training
  NoSalary = 6     // NoSalary
}

interface TargetUserAssignment {
  userId: number;
  roleName: string;
  id: number;
}

interface ProjectTaskAssignment {
  id: number;       
  taskId: number;
  billable: boolean;
}

interface ProjectUserAssignment {
  id: number;       
  userId: number;
  type: number;     
  isTemp: boolean;
}




export default ProjectCardType;
