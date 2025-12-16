import { create } from 'zustand';
import { KeywordResearchEntity } from '@/core/entities';
import { KeywordResearchFormInput } from '../../utils';
import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { useRegionStore } from './RegionStore';
import { useNegativeListStore } from './WordsStoreFactory';
import { useKeywordStore } from '../all-request/context/KeywordSelectionStore';

const EMPTY_FORM: KeywordResearchFormInput = {
  allCitys: false,
  brand: [],
  city: [],
  companyId: 0,
  extraPositiveKeywords: [],
  generatedNegativeKeywords: [],
  generatedPositiveKeywords: [],
  negativeKeywords: [],
  positiveKeywords: [],
  region: [],
  requestLanguage: 'en',
  searchVolume: '0',
  title: '',
  type: 'TRANSACTIONAL',
};

interface FormStore {
  mode: 'create' | 'edit' | 'new';
  keywordResearch: KeywordResearchEntity | null;
  error: string;
  isLoading: boolean;

  setMode: (mode: 'create' | 'edit' | 'new') => void;
  getKeyWordResearch: (id: string) => Promise<void>;

  getInitialValues: () => KeywordResearchFormInput;

  regions: () => void;
  city: () => void;

  clearKeywordResearch: () => void;
  resetKeywordResearch: () => void;
}

export const useFormStore = create<FormStore>((set, get) => ({
  mode: 'create',
  keywordResearch: null,
  error: '',
  isLoading: false,

  setMode: (mode) => set({ mode }),

  clearKeywordResearch: () => set({ keywordResearch: null }),

  resetKeywordResearch: () => set({ keywordResearch: null }),

  getKeyWordResearch: async (id) => {
    try {
      set({ isLoading: true });
      const REPO = new KeywordResearchApiRepository();
      const data = await REPO.findById(id);
      set({ keywordResearch: data });
    } catch (error) {
      set({ error: error as string });
    } finally {
      set({ isLoading: false });
    }
  },

  getInitialValues: () => {
    const { mode, keywordResearch } = get();

    if (mode === 'create') {
      return { ...EMPTY_FORM };
    }

    if (mode === 'new') {
      return {
        ...EMPTY_FORM,
        negativeKeywords: useNegativeListStore.getState().words ?? [],
        positiveKeywords:
          useKeywordStore
            .getState()
            .positivesToNewKeyword.map((el) => el.keyword) ?? [],
      };
    }

    if (mode === 'edit') {
      if (!keywordResearch) {
        return { ...EMPTY_FORM };
      }

      return {
        ...EMPTY_FORM,
        ...keywordResearch,
        searchVolume: String(keywordResearch.searchVolume ?? '0'),
        requestLanguage: keywordResearch.requestLanguage ?? 'en',
      } as KeywordResearchFormInput;
    }

    return { ...EMPTY_FORM };
  },

  regions: () => {
    const { mode, keywordResearch } = get();

    if (mode === 'create' || !keywordResearch?.region) return;

    const rebuiltMap = new Map<number, string[]>(
      keywordResearch.region.map((value, index) => [
        index,
        value.split(/\s*,\s*/).reverse(),
      ])
    );

    useRegionStore.getState().hidrateFinalValue(rebuiltMap);
  },

  city: () => {
    const { mode, keywordResearch } = get();

    if (mode === 'create' || !keywordResearch?.city) return;

    useRegionStore.getState().hidrateNegativeCities(keywordResearch.city);
  },
}));
