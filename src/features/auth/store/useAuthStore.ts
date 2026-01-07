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
  setUser: (user: User | null) => Promise<void>;
  token: string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(credentials);
      const token = await user.getIdToken();
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true });
    try {
      const user = await authService.register(credentials);
      const token = await user.getIdToken();
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      await authService.logout();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error; 
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
        const user = authService.getCurrentUser();
      // Listener in Navigation will handle the actual source of truth
      if (user) {
        const token = await user.getIdToken();
        set({ user, token, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: true }); // Keep loading until listener fires
        }
    } catch (error) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: async (user) => {
    if (user) {
      const token = await user.getIdToken();
      set({ user, token, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
