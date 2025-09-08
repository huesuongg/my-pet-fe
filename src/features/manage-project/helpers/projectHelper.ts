import { ProjectType } from '../types/project.model';
import type { ProjectState } from '../types/project.state';
import { ProjectDetailPayload } from '../types/project.dto';
import { FieldError } from '../types';

export type StatusKey = keyof ProjectState["status"]; 
export const isAnyLoading = (status: ProjectState["status"], keys: StatusKey[]) => {
  return keys
    .filter((key) => key !== "fetch")
    .some((key) => status[key] === "loading");
};

export const alertConfigs: {
  key: StatusKey;
  message: string;
}[] = [
  { key: "delete", message: "Deleted project successfully!" },
  { key: "save", message: "Saved project successfully!" },
  { key: "active", message: "Updated project's status successfully!"}
];

export const projectTypeLabels: Record<ProjectType, string> = {
  [ProjectType.TM]: "T&M",
  [ProjectType.FixedPrice]: "Fixed Price",
  [ProjectType.NonBill]: "Non-Bill",
  [ProjectType.ODC]: "ODC",
  [ProjectType.Product]: "Product",
  [ProjectType.Training]: "Training",
  [ProjectType.NoSalary]: "No Salary"
};

export const validateFormData = (formData: ProjectDetailPayload) => {
  const newErrors: FieldError[] = [];

  //Project Customer
  if (errorProjectCustomer(formData.customerId)) {
    newErrors.push({
      tab: "general",
      field: "customerId",
      message: "Client is required",
    });
  }

  //Project Name
  if (errorProjectName(formData.name)) {
    newErrors.push({
      tab: "general",
      field: "name",
      message: "Project name is required",
    });
  }

  //Project Code
  if (errorProjectCode(formData.code)) {
    newErrors.push({
      tab: "general",
      field: "code",
      message: "Project code is required",
    });
  }

  //Time start
  if (errorStartTime(formData.timeStart)) {
    newErrors.push({
      tab: "general",
      field: "timeStart",
      message: "Time start is required",
    });
  }
  
  //Time End
  if (errorEndTime(formData.timeStart, formData.timeEnd)) {
    newErrors.push({
      tab: "general",
      field: "timeEnd",
      message: "Time end must be after time start",
    });
  }

  //User List
  if (errorUserList(formData.users) || errorTypeUser(formData.users)) {
    newErrors.push({
      tab: "team",
      field: "users",
      message: "At least one user as PM must be selected",
    });
  }

  //Task List
  if (errorTaskList(formData.tasks)) {
    newErrors.push({
      tab: "tasks",
      field: "tasks",
      message: "At least one task must be selected",
    });
  }


  return newErrors;
};

export const errorProjectName = (name: ProjectDetailPayload["name"]) => {
  return name.trim() === "";
};

export const errorProjectCode = (code: ProjectDetailPayload["code"]) => {
  return code.trim() === "";
}; 

export const errorProjectCustomer = (customerId: ProjectDetailPayload["customerId"]) => {
  return customerId <= 0;
}; 

export const errorStartTime = (timeStart: ProjectDetailPayload["timeStart"]) => {
  return timeStart.trim()==="";
}; 

export const errorTaskList = (tasks: ProjectDetailPayload["tasks"]) => {
  return tasks.length === 0;
};

export const errorUserList = (users: ProjectDetailPayload["users"]) => {
  return users.length === 0;
};

export const errorEndTime = (
  timeStart: ProjectDetailPayload["timeStart"],
  timeEnd: ProjectDetailPayload["timeEnd"]
) => {
  if (!timeStart || !timeEnd) return false; 
  return new Date(timeEnd) < new Date(timeStart);
};

export const errorTypeUser = (users: ProjectDetailPayload["users"]) => {
  return !users.some(user => user.type === 1);
};
