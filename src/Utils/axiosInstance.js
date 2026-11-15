import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "https://konfigurime-api.arkiva.gov.al",
  withCredentials: true,
});

// Auth endpoints must never trigger the refresh-and-retry logic below
// (a wrong password returns 401 too).
const AUTH_ENDPOINTS = [
  "/user/login",
  "/user/2fa/verify",
  "/user/refresh",
  "/user/logout",
];
const isAuthEndpoint = (url = "") =>
  AUTH_ENDPOINTS.some((endpoint) => url.endsWith(endpoint));

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !isAuthEndpoint(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Several requests can fail at the same time when the access token expires;
// they all wait for a single refresh call.
let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post("/user/refresh")
      .then((res) => {
        const newToken = res.data.token;
        localStorage.setItem("token", newToken);
        return newToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        toast.error("Session expired", { toastId: "session-expired" });
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
