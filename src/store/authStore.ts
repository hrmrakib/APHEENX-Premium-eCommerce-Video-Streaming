import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  fullName: string;
  email: string;
  verified: boolean;
  role?: "user" | "admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      setAuth: (user, token) => set({ user, token }),
      setLoading: (isLoading) => set({ isLoading }),
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "apheenx_auth", // name of the item in the storage (must be unique)
    },
  ),
);
