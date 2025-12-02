import axios from "axios";

// Function to select the correct URL based on the environment
const getBaseUrl = () => {
  // 1. SERVER-SIDE (SSR)
  // Logic: "I am running inside the Docker container."
  // I should talk to my sibling container 'backend' directly.
  if (typeof window === "undefined") {
    // If INTERNAL_API_URL is missing, we fallback to the Docker service name
    return process.env.INTERNAL_API_URL || "http://backend:8000/api";
  }

  // 2. CLIENT-SIDE (Browser)
  // Logic: "I am running on the user's laptop/phone."
  // I must talk to the public Nginx address.
  return process.env.NEXT_PUBLIC_API_URL || "https://tangapano.co.zw/api";
};

export const apiConfig = {
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
};

export const axiosInstance = axios.create(apiConfig);
