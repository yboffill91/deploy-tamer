import { KeywordResearchEntity } from '@/core/entities';
import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { create } from 'zustand';
import { useRegionStore } from './RegionStore';
import {
  useBrandStore,
  useExtraPositiveStore,
  useNegativeStore,
  usePositiveStore,
} from './WordsStoreFactory';

interface FormStore {
  mode: 'create' | 'edit';
  keywordResearch: KeywordResearchEntity;
  error: string;
  searchVolume: () => string;
  language: () => string;
  getKeyWordResearch: (id: string) => Promise<void>;
  title: () => string;
  regions: () => Map<number, string[]>;
  positive: () => void;
  negative: () => void;
  extraPositive: () => void;
  brands: () => void;
  city: () => void;
  type: () => void;
  setMode: () => void;
}

export const useFormStore = create<FormStore>((set, get) => ({
  mode: 'create',
  keywordResearch: null,
  error: '',

  getKeyWordResearch: async (id) => {
    const { mode } = get();
    if (mode === 'create') return null;
    try {
      const REPO = new KeywordResearchApiRepository();
      const Data = await REPO.findById(id);
      set({ keywordResearch: Data });
    } catch (err) {
      set({ error: err as string });
    }
  },

  title: () => {
    const { mode, keywordResearch } = get();
    if (mode === 'create') return '';
    return keywordResearch.title;
  },

  searchVolume: () => {
    const { mode, keywordResearch } = get();
    return mode === 'create' ? '0' : String(keywordResearch.searchVolume);
  },

  language: () => {
    const { mode, keywordResearch } = get();
    return mode === 'create' ? 'EN' : String(keywordResearch.requestLanguage);
  },

  setMode: () => {
    set({ mode: 'edit' });
  },

  regions: (): Map<number, string[]> => {
    const { mode, keywordResearch } = get();

    const reBuildedMap = new Map<number, string[]>(
      keywordResearch.region!.map((value, index) => [
        index,
        value.split(/\s*,\s*/),
      ])
    );

    return mode === 'create'
      ? new Map<number, string[]>()
      : useRegionStore.getState().hidrateFinalValue(reBuildedMap);
  },
  positive: () => {
    const { mode, keywordResearch } = get();
    return mode === 'create'
      ? []
      : usePositiveStore
          .getState()
          .hidrateWords(keywordResearch.positiveKeywords);
  },
  negative: () => {
    const { mode, keywordResearch } = get();
    return mode === 'create'
      ? []
      : useNegativeStore
          .getState()
          .hidrateWords(keywordResearch.negativeKeywords);
  },
  extraPositive: () => {
    const { mode, keywordResearch } = get();
    return mode === 'create'
      ? []
      : useExtraPositiveStore
          .getState()
          .hidrateWords(keywordResearch.extraPositiveKeywords);
  },
  brands: () => {
    const { mode, keywordResearch } = get();
    return mode === 'create'
      ? []
      : useBrandStore.getState().hidrateWords(keywordResearch.brand);
  },
  city: () => {
    const { mode, keywordResearch } = get();
    return mode === 'create' ? [] : [...keywordResearch.city];
  },

  type: () => {
    const { mode, keywordResearch } = get();
    return mode === 'create' ? 'TRANSACTIONAL' : keywordResearch.type;
  },
}));
