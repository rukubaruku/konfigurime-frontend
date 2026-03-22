import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "https://konfigurime-api.arkiva.gov.al:3109",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired");
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
