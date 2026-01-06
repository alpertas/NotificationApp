import { create } from 'zustand';
import { User } from 'firebase/auth';
import { authService } from '../services/authService';
import { LoginCredentials, RegisterCredentials } from '../authTypes';
import { storage } from '../../../core/utils/storage';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true });
    try {
      const user = await authService.register(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error; 
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
        const token = await storage.getToken();
        const user = authService.getCurrentUser();
        
        // If we have a token (or auth persistence handled it)
        // Note: Firebase usually handles persistence automatically if configured.
        // We'll trust Firebase auth state listener mainly, but for now prompt check.
       if (user) {
           set({ user, isAuthenticated: true, isLoading: false });
       } else {
           // Wait a bit for firebase to init if strictly needed, or just set false
           // Ideally we subscribe to onAuthStateChanged in App.tsx
           set({ user: null, isAuthenticated: false, isLoading: false });
       }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
