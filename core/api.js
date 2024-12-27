import axios from "axios";

import { useAuthStore } from "@/stores/auth";
import router from "@/router";
import CONFIG from "@/utils/config";

const api = axios.create({
  baseURL: CONFIG.APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const { user } = useAuthStore();
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    switch (error.response?.status) {
      case 401:
        return handleUnauthorized(error);
      case 403:
        router.push({ path: "/error/403", replace: true });
        break;
      case 404:
        router.push({ path: "/error/404", replace: true });
        break;
      default:
        break;
    }
    return Promise.reject(error);
  },
);

const initHandleUnauthorized = () => {
  let isRefreshing = false;
  let pendingQueue = [];

  const processQueue = (isFailed) => {
    pendingQueue.forEach((promise) => {
      if (isFailed) {
        promise.reject();
      } else {
        promise.resolve();
      }
    });

    pendingQueue = [];
  };

  const handleUnauthorized = async (error) => {
    const { user, updateUser, logout } = useAuthStore();
    const refreshToken = user?.refreshToken;

    if (!refreshToken || error.config._retry) {
      logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then(
        () => api(error.config),
        () => Promise.reject(error),
      );
    }

    isRefreshing = true;
    error.config._retry = true;

    try {
      const formData = new FormData();
      formData.append("refreshToken", refreshToken);
      const response = await axios.post(`${CONFIG.APP_API_URL}/refresh`, formData);
      const tokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
      updateUser({ ...user, ...tokens });

      processQueue(false);
      return api(error.config);
    } catch (e) {
      processQueue(true);
      logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  };

  return { handleUnauthorized };
};

const { handleUnauthorized } = initHandleUnauthorized();

export default api;