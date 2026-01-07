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
    const token = await storage.getToken();
    console.log(`🔵 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔵 [API Request] Authorization header attached');
    } else {
      console.log('🔵 [API Request] No token found in storage');
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
