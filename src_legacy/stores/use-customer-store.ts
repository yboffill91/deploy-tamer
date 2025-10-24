// stores/useCustomerStore.ts
import { create } from "zustand";
import { Customer } from "@/lib/api/types";

interface CustomerStore {
  customer: Customer | null;
  recentLeads: any[]; // ✅ Mantener toda la estructura si es necesario
  totalVisitors: any[];
  setCustomerData: (data: { customer: Customer; recentLeads?: any[]; totalVisitors?: any[] }) => void;
  updateCustomer: (updates: Partial<Customer>) => void;
  clearCustomer: () => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customer: null,
  recentLeads: [],
  totalVisitors: [],

  // ✅ Nueva función para setear todos los datos
  setCustomerData: (data) =>
    set({
      customer: data.customer,
      recentLeads: data.recentLeads || [],
      totalVisitors: data.totalVisitors || [],
    }),

  updateCustomer: (updates) =>
    set((state) => ({
      customer: state.customer ? { ...state.customer, ...updates } : null,
    })),

  clearCustomer: () =>
    set({
      customer: null,
      recentLeads: [],
      totalVisitors: [],
    }),
}));
