import axios from "axios";

const BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL // server-side in Docker
    : process.env.NODE_ENV == "production"
    ? `${window.location.origin}/api` // client-side in browser during production
    : `http://localhost/api`; // client-side in browser during development

export const apiConfig = {
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

export const axiosInstance = axios.create(apiConfig);
