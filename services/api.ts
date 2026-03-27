import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { triggerLogout } from './authEvents';

const BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/'
  : 'https://fapla-backend.onrender.com/';

const api = axios.create({
  //baseURL: 'http://10.0.2.2:8000/',
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const credentials = await Keychain.getGenericPassword();
        if (!credentials) throw error;

        const { refresh } = JSON.parse(credentials.password);

        const response = await axios.post(
          'https://fapla-backend.onrender.com/api/auth/refresh/',
          { refresh }
        );

        const newAccess = response.data.access;

        api.defaults.headers.common.Authorization =
          `Bearer ${newAccess}`;
        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        await Keychain.setGenericPassword(
          'jwt',
          JSON.stringify({
            access: newAccess,
            refresh,
          })
        );

        processQueue(null, newAccess);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        
        // refresh token invalid → force logout
        await Keychain.resetGenericPassword();
        triggerLogout();

        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
