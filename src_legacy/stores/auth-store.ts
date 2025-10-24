import { create } from "zustand";

type AuthState = {
  bearerToken: string | null;
  fcmToken: string | null;
  setBearerToken: (token: string | null) => void;
  setFcmToken: (token: string | null) => void;
  resetAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  bearerToken: null,
  fcmToken: null,
  setBearerToken: (token) => set({ bearerToken: token }),
  setFcmToken: (token) => set({ fcmToken: token }),
  resetAuth: () => set({ bearerToken: null, fcmToken: null }),
}));
