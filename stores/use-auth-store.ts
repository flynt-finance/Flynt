import { create } from "zustand";
import { getCurrentUser } from "@/lib/api/requests";
import { clearToken } from "@/lib/auth-cookie";
import type { User } from "@/lib/api/types";

interface AuthState {
  user: User | null
  setData: (partial: Partial<{ user: User | null }>) => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setData: (partial) => set(partial),
  fetchUser: async () => {
    try {
      const response = await getCurrentUser();
      if (response.success && response.data?.user) {
        set({ user: response.data.user });
      }
    } catch {
      set({ user: null });
      clearToken();
    }
  },
}));
