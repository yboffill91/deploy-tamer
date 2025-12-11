import { KeywordResearchEntity } from '@/core/entities';
import { KeywordResearchFormInput } from '../../utils';
import { create } from 'zustand';
import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { useRegionStore } from './RegionStore';

type InitialFormValues = KeywordResearchFormInput | null;

interface FormStore {
  mode: 'create' | 'edit';
  keywordResearch: KeywordResearchEntity | null;
  error: string;
  setMode: (mode: 'create' | 'edit') => void;
  getKeyWordResearch: (id: string) => Promise<void>;
  isLoading: boolean;
  getInitialValues: () => InitialFormValues;
  regions: () => void;
  city: () => void;
  clearKeywordResearch: () => void;
}

export const useFormStore = create<FormStore>((set, get) => ({
  mode: 'create',
  keywordResearch: null,
  error: '',
  isLoading: false,

  setMode: (mode) => {
    set({ mode });
  },
  clearKeywordResearch: () => set({ keywordResearch: null }),

  getKeyWordResearch: async (id) => {
    try {
      set({ isLoading: true });
      const REPO = new KeywordResearchApiRepository();
      const Data = await REPO.findById(id);
      set({ keywordResearch: Data });
    } catch (error) {
      set({ error: error as string });
    } finally {
      set({ isLoading: false });
    }
  },

  getInitialValues: () => {
    const { mode, keywordResearch } = get();

    if (mode === 'create' || !keywordResearch) {
      return {
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
        requestLanguage: '',
        searchVolume: '0',
        title: '',
        type: 'TRANSACTIONAL',
      };
    }

    return {
      allCitys: keywordResearch.allCitys || false,
      brand: keywordResearch.brand || [],
      city: keywordResearch.city || [],
      companyId: keywordResearch.companyId || 0,
      extraPositiveKeywords: keywordResearch.extraPositiveKeywords || [],
      generatedNegativeKeywords:
        keywordResearch.generatedNegativeKeywords || [],
      generatedPositiveKeywords:
        keywordResearch.generatedPositiveKeywords || [],
      negativeKeywords: keywordResearch.negativeKeywords || [],
      positiveKeywords: keywordResearch.positiveKeywords || [],
      region: keywordResearch.region,
      requestLanguage: keywordResearch.requestLanguage,
      searchVolume: String(keywordResearch.searchVolume),
      title: keywordResearch.title,
      type: keywordResearch.type,
    } as KeywordResearchFormInput;
  },
  regions: () => {
    const { mode, keywordResearch } = get();

    if (mode === 'create' || !keywordResearch || !keywordResearch.region)
      return;
    const reBuildedMap = new Map<number, string[]>(
      keywordResearch.region.map((value, index) => [
        index,
        value.split(/\s*,\s*/).reverse(),
      ])
    );
    useRegionStore.getState().hidrateFinalValue(reBuildedMap);
  },
  city: () => {
    const { mode, keywordResearch } = get();

    if (mode === 'create' || !keywordResearch || !keywordResearch.city) {
      return [];
    }

    const citiesFromEntity = keywordResearch.city;

    useRegionStore.getState().hidrateNegativeCities(citiesFromEntity);

    return citiesFromEntity;
  },
}));
