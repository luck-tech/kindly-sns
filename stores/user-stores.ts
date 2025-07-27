import { create } from "zustand";
import { UserState } from "@/types/user";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  fetchUser: async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        set({ user: data });
      } else {
        set({ user: null });
      }
    } catch (e) {
      set({ user: null });
    }
  },
}));
