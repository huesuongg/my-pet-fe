import axiosInstance from "../../services/axiosInstance";
import { LoginPayload } from "./types";

export const loginAPI = (data: LoginPayload) => {
  return axiosInstance.post('/TokenAuth/Authenticate',{
    userNameOrEmailAddress: data.username,
    password: data.password,
    rememberClient: data.rememberClient
  }, {
    withCredentials: true
  });
};
