import axios from "axios";
import { getServerOrigin } from "./serverOrigin.js";

const origin = getServerOrigin();
if (!origin && import.meta.env.DEV) {
  console.error(
    "ChatWave: Set VITE_API_URL or VITE_DB_ORIGIN in Frontend/.env for the API base URL.",
  );
}

export const axiosInstance = axios.create({
  baseURL: origin ? `${origin}/api/v1` : "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
