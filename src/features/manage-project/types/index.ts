import { ProjectDetailPayload } from "./project.dto";

export type FieldError = {
  tab: "general"|"team"|"tasks"|"notification";  
  field: keyof ProjectDetailPayload; 
  message: string;
}

export enum FilterType {
  ALL = "all",
  INACTIVE = "inactive",
  ACTIVE = "active"
}