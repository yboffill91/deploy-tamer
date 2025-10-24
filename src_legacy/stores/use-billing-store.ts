import { create } from "zustand";

interface BillingStore {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  isPortalLoading: boolean;
  setPortalLoading: (loading: boolean) => void;
  paymentIntentClientSecret: string | null;
  setPaymentIntentClientSecret: (secret: string | null) => void;
}

export const useBillingStore = create<BillingStore>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  isPortalLoading: false,
  setPortalLoading: (loading) => set({ isPortalLoading: loading }),
  paymentIntentClientSecret: null,
  setPaymentIntentClientSecret: (secret) => set({ paymentIntentClientSecret: secret }),
}));
