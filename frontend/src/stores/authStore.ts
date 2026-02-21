import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { mockLogin, mockRegister, mockLogout } from '../api/mock';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await mockLogin({ email, password });
          set({ user, isAuthenticated: true, isLoading: false, error: null });
          return true;
        } catch (e) {
          set({
            isLoading: false,
            error: e instanceof Error ? e.message : 'Ошибка входа',
          });
          return false;
        }
      },
      register: async (email, password, displayName) => {
        set({ isLoading: true, error: null });
        try {
          const user = await mockRegister({ email, password, displayName });
          set({ user, isAuthenticated: true, isLoading: false, error: null });
          return true;
        } catch (e) {
          set({
            isLoading: false,
            error: e instanceof Error ? e.message : 'Ошибка регистрации',
          });
          return false;
        }
      },
      logout: async () => {
        set({ isLoading: true });
        await mockLogout();
        set({ user: null, isAuthenticated: false, isLoading: false, error: null });
      },
      clearError: () => set({ error: null }),
    }),
    { name: 'onco-auth', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
);
