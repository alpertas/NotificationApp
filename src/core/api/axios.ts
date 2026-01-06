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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    return Promise.reject(error);
  }
);

export default api;
