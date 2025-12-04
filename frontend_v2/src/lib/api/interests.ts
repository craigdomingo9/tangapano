import { axiosInstance } from "./config";

export function postInterest(data: Interest) {
  return axiosInstance.post("/interests/inquiries/", data);
}
