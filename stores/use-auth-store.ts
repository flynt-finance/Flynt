import { create } from "zustand";
import { getCurrentUser } from "@/lib/api/requests";
import { clearToken, setUpdatedUserCookie } from "@/lib/auth-cookie";
import type { User } from "@/lib/api/types";

const isUserLike = (v: unknown): v is User =>
  v != null &&
  typeof v === "object" &&
  typeof (v as User).id === "string" &&
  typeof (v as User).email === "string" &&
  typeof (v as User).name === "string";

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
      if (!response?.success || !response.data) return;
      const data = response.data as { user?: User } | User;
      const user: User | undefined =
        data && typeof data === "object" && "user" in data && data.user
          ? (data as { user: User }).user
          : isUserLike(data)
            ? (data as User)
            : undefined;
      if (user) {
        set({ user });
        setUpdatedUserCookie(user);
      }
    } catch {
      set({ user: null });
      clearToken();
    }
  },
}));
