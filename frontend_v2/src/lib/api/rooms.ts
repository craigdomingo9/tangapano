import { axiosInstance } from "./config";

export const RoomsApi = {
  createRoom: (data: Partial<Room>, accessToken: string) => {
    return axiosInstance.post("/listings/rooms/", data, {
      headers: { Authorization: `Token ${accessToken}` },
    });
  },
  updateRoom: (roomId: string, data: Partial<Room>, accessToken: string) => {
    return axiosInstance.patch(`/listings/rooms/${roomId}/`, data, {
      headers: { Authorization: `Token ${accessToken}` },
    });
  },
};
