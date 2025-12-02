import axios from "axios";

// Function to select the correct URL based on the environment
const getBaseUrl = () => {
  // 1. SERVER-SIDE (SSR)
  // When Next.js fetches data on the server, it needs an absolute internal URL.
  // In Docker, this might be "http://backend_container:8000/api"
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost/api";
  }

  // 2. CLIENT-SIDE (Browser)
  // The browser uses the public URL.
  return process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost/api";
};

export const apiConfig = {
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
};

export const axiosInstance = axios.create(apiConfig);
