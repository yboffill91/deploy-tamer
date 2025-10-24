import { create } from "zustand";
import { City } from "@/types/cities";

interface CityStore {
  // -----------------
  // Dialogs
  // -----------------
  showAddDialog: boolean;
  setShowAddDialog: (open: boolean) => void;

  showEditDialog: boolean;
  setShowEditDialog: (open: boolean) => void;

  // -----------------
  // Current editing city
  // -----------------
  editingCity: City | null;
  setEditingCity: (city: City | null) => void;

  // -----------------
  // Search & Pagination
  // -----------------
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;

  ITEMS_PER_PAGE: number;
}

export const useCityStore = create<CityStore>((set) => ({
  // -----------------
  // Dialogs
  // -----------------
  showAddDialog: false,
  setShowAddDialog: (open: boolean) => set({ showAddDialog: open }),

  showEditDialog: false,
  setShowEditDialog: (open: boolean) => set({ showEditDialog: open }),

  // -----------------
  // Current editing city
  // -----------------
  editingCity: null,
  setEditingCity: (city) => set({ editingCity: city }),

  // -----------------
  // Search & Pagination
  // -----------------
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),

  ITEMS_PER_PAGE: 15,
}));
