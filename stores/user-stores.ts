import { create } from "zustand";
import { UserState } from "@/types/user";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  fetchUser: async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        set({ user: data, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (e) {
      set({ user: null, isLoading: false });
    }
  },
}));
