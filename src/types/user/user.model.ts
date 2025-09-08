export interface UserType {
  id: number;
  name: string;
  emailAddress: string;
  isActive: boolean;
  type: number; 
  jobTitle: string | null;
  level: string | null;
  userCode: string | null;
  avatarPath: string;
  avatarFullPath: string;
  branch: number;
  branchColor: string;
  branchDisplayName: string;
  branchId: number;
  positionId: number;
  positionName: string;
}
