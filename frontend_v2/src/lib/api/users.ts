import { axiosInstance } from "./config";

function login(data: { username: string; password: string }) {
  return axiosInstance.post("/users/login/", data);
}
