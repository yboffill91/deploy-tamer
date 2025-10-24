import { create } from "zustand";
import { SelectedLanguage, SelectedRegion, BrandFilter } from "@/types/keyword-request";

interface KeywordResearchStore {
  // Form state
  title: string;
  volume: number;
  searchType: string;
  cities: string[];
  useAllCities: boolean;
  selectedLanguage: SelectedLanguage | null;
  selectedRegion: SelectedRegion[];
  brandFilters: BrandFilter;

  // Keywords
  targetKeywords: string[];
  negativeKeywords: string[];
  extraKeywords: string[];

  // UI state
  showTutorial: boolean;
  showTargetSuggestions: boolean;
  showNegativeSuggestions: boolean;
  showBrandDialog: boolean;
  showLanguageDialog: boolean;
  showRegionDialog: boolean;
  showNotificationsDialog: boolean;
  targetSuggestions: string[];
  negativeSuggestions: string[];
  selectedTargetSuggestions: string[];
  selectedNegativeSuggestions: string[];

  // Actions
  setTitle: (title: string) => void;
  setVolume: (volume: number) => void;
  setSearchType: (searchType: string) => void;
  setCities: (cities: string[]) => void;
  setUseAllCities: (useAllCities: boolean) => void;
  setSelectedLanguage: (language: SelectedLanguage | null) => void;
  setSelectedRegion: (regions: SelectedRegion[]) => void;
  setBrandFilters: (filters: BrandFilter) => void;

  // Keywords actions
  addTargetKeyword: (keyword: string) => void;
  removeTargetKeyword: (index: number) => void;
  addNegativeKeyword: (keyword: string) => void;
  removeNegativeKeyword: (index: number) => void;
  addExtraKeyword: (keyword: string) => void;
  removeExtraKeyword: (index: number) => void;

  // UI actions
  setShowTutorial: (show: boolean) => void;
  setShowTargetSuggestions: (show: boolean) => void;
  setShowBrandDialog: (show: boolean) => void;
  setShowNegativeSuggestions: (show: boolean) => void;
  setShowLanguageDialog: (show: boolean) => void;
  setShowRegionDialog: (show: boolean) => void;
  setShowNotificationsDialog: (show: boolean) => void;
  setTargetSuggestions: (suggestions: string[]) => void;
  setNegativeSuggestions: (suggestions: string[]) => void;
  toggleTargetSuggestion: (word: string) => void;
  toggleNegativeSuggestion: (word: string) => void;
  addSelectedTargetSuggestions: () => void;
  addSelectedNegativeSuggestions: () => void;

  // Reset form
  resetForm: () => void;
}

const initialState = {
  title: "",
  volume: 100,
  searchType: "transactional",
  cities: [],
  useAllCities: false,
  selectedLanguage: null,
  selectedRegion: [],
  brandFilters: {},
  targetKeywords: [],
  negativeKeywords: [],
  extraKeywords: [],
  showTutorial: false,
  showBrandDialog: false,
  showTargetSuggestions: false,
  showNegativeSuggestions: false,
  showLanguageDialog: false,
  showRegionDialog: false,
  showNotificationsDialog: false,
  targetSuggestions: [],
  negativeSuggestions: [],
  selectedTargetSuggestions: [],
  selectedNegativeSuggestions: [],
};

export const useKeywordResearchStore = create<KeywordResearchStore>((set, get) => ({
  ...initialState,

  setTitle: (title) => set({ title }),
  setVolume: (volume) => set({ volume }),
  setSearchType: (searchType) => set({ searchType }),
  setCities: (cities) => set({ cities }),
  setUseAllCities: (useAllCities) => set({ useAllCities }),
  setSelectedLanguage: (selectedLanguage) => set({ selectedLanguage }),
  setSelectedRegion: (selectedRegion) => set({ selectedRegion }),
  setBrandFilters: (brandFilters) => set({ brandFilters }),

  addTargetKeyword: (keyword) => set((state) => ({ targetKeywords: [...state.targetKeywords, keyword] })),
  removeTargetKeyword: (index) =>
    set((state) => ({ targetKeywords: state.targetKeywords.filter((_, i) => i !== index) })),

  addNegativeKeyword: (keyword) => set((state) => ({ negativeKeywords: [...state.negativeKeywords, keyword] })),
  removeNegativeKeyword: (index) =>
    set((state) => ({ negativeKeywords: state.negativeKeywords.filter((_, i) => i !== index) })),

  addExtraKeyword: (keyword) => set((state) => ({ extraKeywords: [...state.extraKeywords, keyword] })),
  removeExtraKeyword: (index) => set((state) => ({ extraKeywords: state.extraKeywords.filter((_, i) => i !== index) })),

  setShowTutorial: (showTutorial) => set({ showTutorial }),
  setShowTargetSuggestions: (showTargetSuggestions) => set({ showTargetSuggestions }),
  setShowBrandDialog: (showBrandDialog) => set({ showBrandDialog }),
  setShowNegativeSuggestions: (showNegativeSuggestions) => set({ showNegativeSuggestions }),
  setShowLanguageDialog: (showLanguageDialog) => set({ showLanguageDialog }),
  setShowRegionDialog: (showRegionDialog) => set({ showRegionDialog }),
  setShowNotificationsDialog: (showNotificationsDialog) => set({ showNotificationsDialog }),
  setTargetSuggestions: (suggestions) => set({ targetSuggestions: suggestions }),
  setNegativeSuggestions: (suggestions) => set({ negativeSuggestions: suggestions }),

  toggleTargetSuggestion: (word) =>
    set((state) => ({
      selectedTargetSuggestions: state.selectedTargetSuggestions.includes(word)
        ? state.selectedTargetSuggestions.filter((w) => w !== word)
        : [...state.selectedTargetSuggestions, word],
    })),

  toggleNegativeSuggestion: (word) =>
    set((state) => ({
      selectedNegativeSuggestions: state.selectedNegativeSuggestions.includes(word)
        ? state.selectedNegativeSuggestions.filter((w) => w !== word)
        : [...state.selectedNegativeSuggestions, word],
    })),

  addSelectedTargetSuggestions: () => {
    const state = get();
    state.selectedTargetSuggestions.forEach((keyword) => {
      state.addTargetKeyword(keyword);
    });
    set({
      selectedTargetSuggestions: [],
      showTargetSuggestions: false,
    });
  },

  addSelectedNegativeSuggestions: () => {
    const state = get();
    state.selectedNegativeSuggestions.forEach((keyword) => {
      state.addNegativeKeyword(keyword);
    });
    set({
      selectedNegativeSuggestions: [],
      showNegativeSuggestions: false,
    });
  },

  resetForm: () => set(initialState),
}));
