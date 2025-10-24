import { create } from "zustand";
import { Company } from "@/types/companies";

interface CompanyStore {
  companies: Company[];
  searchQuery: string;
  currentPage: number;
  editingCompany: Company | null;
  showAddDialog: boolean;
  showEditDialog: boolean;
  setCompanies: (companies: Company[]) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setEditingCompany: (company: Company | null) => void;
  setShowAddDialog: (show: boolean) => void;
  setShowEditDialog: (show: boolean) => void;
  addCompany: (company: Company) => void;
  updateCompany: (companyId: number, updates: Partial<Company>) => void;
  removeCompany: (companyId: number) => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  companies: [],
  searchQuery: "",
  currentPage: 1,
  editingCompany: null,
  showAddDialog: false,
  showEditDialog: false,

  setCompanies: (companies) => set({ companies }),
  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setEditingCompany: (editingCompany) => set({ editingCompany }),
  setShowAddDialog: (showAddDialog) => set({ showAddDialog }),
  setShowEditDialog: (showEditDialog) => set({ showEditDialog }),

  addCompany: (company) =>
    set((state) => ({
      companies: [company, ...state.companies],
    })),

  updateCompany: (companyId, updates) =>
    set((state) => ({
      companies: state.companies.map((company) => (company.id === companyId ? { ...company, ...updates } : company)),
    })),

  removeCompany: (companyId) =>
    set((state) => ({
      companies: state.companies.filter((company) => company.id !== companyId),
    })),
}));
