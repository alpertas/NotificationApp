import axios from 'axios';
import { ENV } from '../config/env';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const { useAuthStore } = require('../../features/auth/store/useAuthStore');
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401 || status === 500) {
        console.error(`🔴 [API Error] Status: ${status}`, data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
