import { create } from "zustand";
import { NegativeKeywordSI } from "@/types/negative-keyword-si";

interface NegativeKeywordSIStore {
  negativeKeywords: NegativeKeywordSI[];
  isLoading: boolean;
  error: string;
  searchQuery: string;
  intentFilter: string;
  currentPage: number;
  showAddDialog: boolean;
  showEditDialog: boolean;
  editingKeyword: NegativeKeywordSI | null;

  // Actions
  setNegativeKeywords: (keywords: NegativeKeywordSI[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  setSearchQuery: (query: string) => void;
  setIntentFilter: (filter: string) => void;
  setCurrentPage: (page: number) => void;
  setShowAddDialog: (show: boolean) => void;
  setShowEditDialog: (show: boolean) => void;
  setEditingKeyword: (keyword: NegativeKeywordSI | null) => void;
  addKeyword: (keyword: NegativeKeywordSI) => void;
  updateKeyword: (keywordId: number, updates: Partial<NegativeKeywordSI>) => void;
  removeKeyword: (keywordId: number) => void;
}

export const useNegativeKeywordSIStore = create<NegativeKeywordSIStore>((set) => ({
  negativeKeywords: [],
  isLoading: true,
  error: "",
  searchQuery: "",
  intentFilter: "all",
  currentPage: 1,
  showAddDialog: false,
  showEditDialog: false,
  editingKeyword: null,

  setNegativeKeywords: (negativeKeywords) => set({ negativeKeywords }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setIntentFilter: (intentFilter) => set({ intentFilter, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setShowAddDialog: (showAddDialog) => set({ showAddDialog }),
  setShowEditDialog: (showEditDialog) => set({ showEditDialog }),
  setEditingKeyword: (editingKeyword) => set({ editingKeyword }),
  addKeyword: (keyword) =>
    set((state) => ({
      negativeKeywords: [keyword, ...state.negativeKeywords],
    })),
  updateKeyword: (keywordId, updates) =>
    set((state) => ({
      negativeKeywords: state.negativeKeywords.map((keyword) =>
        keyword.negative_keyword_by_si_id === keywordId ? { ...keyword, ...updates } : keyword,
      ),
    })),
  removeKeyword: (keywordId) =>
    set((state) => ({
      negativeKeywords: state.negativeKeywords.filter((keyword) => keyword.negative_keyword_by_si_id !== keywordId),
    })),
}));
