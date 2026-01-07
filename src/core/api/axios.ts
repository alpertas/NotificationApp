import axios from 'axios';
import { ENV } from '../config/env';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Token
api.interceptors.request.use(
  async (config) => {
    // OLD: const token = await storage.getToken();
    // NEW: Read from Store directly for synchronous/fast access and cache consistency
    const { useAuthStore } = require('../../features/auth/store/useAuthStore');
    const token = useAuthStore.getState().token;

    console.log(`🔵 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔵 [API Request] Authorization header attached');
    } else {
      console.log('🔵 [API Request] No token found in store');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 (Optional - can be expanded)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 401 via error.response.status if needed
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
