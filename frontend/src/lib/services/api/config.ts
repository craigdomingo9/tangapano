import axios from "axios";

const BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL // server-side in Docker
    : `${window.location.origin}/api`; // client-side in browser

export const apiConfig = {
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

export const axiosInstance = axios.create(apiConfig);
