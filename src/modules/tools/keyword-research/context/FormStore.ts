// import { KeywordResearchEntity } from '@/core/entities';
// import { KeywordResearchFormInput } from '../../utils';
// import { create } from 'zustand';
// import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
// import { useRegionStore } from './RegionStore';
// import { useNegativeListStore } from './WordsStoreFactory';
// import { useKeywordStore } from '../all-request/context/KeywordSelectionStore';

// type InitialFormValues = KeywordResearchFormInput | null;

// interface FormStore {
//   mode: 'create' | 'edit' | 'new';
//   keywordResearch: KeywordResearchEntity | null;
//   error: string;
//   setMode: (mode: 'create' | 'edit' | 'new') => void;
//   getKeyWordResearch: (id: string) => Promise<void>;
//   isLoading: boolean;
//   getInitialValues: () => InitialFormValues;
//   regions: () => void;
//   city: () => void;
//   clearKeywordResearch: () => void;
//   resetKeywordResearch: () => void;
// }

// export const useFormStore = create<FormStore>((set, get) => ({
//   mode: 'create',
//   keywordResearch: null,
//   error: '',
//   isLoading: false,

//   setMode: (mode) => {
//     set({ mode });
//   },
//   clearKeywordResearch: () => set({ keywordResearch: null }),

//   getKeyWordResearch: async (id) => {
//     try {
//       set({ isLoading: true });
//       const REPO = new KeywordResearchApiRepository();
//       const Data = await REPO.findById(id);
//       set({ keywordResearch: Data });
//     } catch (error) {
//       set({ error: error as string });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   getInitialValues: () => {
//     const { mode, keywordResearch } = get();

//     if (mode === 'create') {
//       return {
//         allCitys: false,
//         brand: [],
//         city: [],
//         companyId: 0,
//         extraPositiveKeywords: [],
//         generatedNegativeKeywords: [],
//         generatedPositiveKeywords: [],
//         negativeKeywords: [],
//         positiveKeywords: [],
//         region: [],
//         requestLanguage: '',
//         searchVolume: '0',
//         title: '',
//         type: 'TRANSACTIONAL',
//       };
//     }

//     if (mode === 'new') {
//       return {
//         allCitys: false,
//         brand: [],
//         city: [],
//         companyId: 0,
//         extraPositiveKeywords: [],
//         generatedNegativeKeywords: [],
//         generatedPositiveKeywords: [],
//         negativeKeywords: useNegativeListStore.getState().words ?? [],
//         positiveKeywords:
//           useKeywordStore
//             .getState()
//             .positivesToNewKeyword.map((el) => el.keyword) ?? [],
//         region: [],
//         requestLanguage: '',
//         searchVolume: '0',
//         title: '',
//         type: 'TRANSACTIONAL',
//       };
//     }

//     if (mode === 'edit') {
//       return {
//         allCitys: keywordResearch.allCitys || false,
//         brand: keywordResearch.brand || [],
//         city: keywordResearch.city || [],
//         companyId: keywordResearch.companyId || 0,
//         extraPositiveKeywords: keywordResearch.extraPositiveKeywords || [],
//         generatedNegativeKeywords:
//           keywordResearch.generatedNegativeKeywords || [],
//         generatedPositiveKeywords:
//           keywordResearch.generatedPositiveKeywords || [],
//         negativeKeywords: keywordResearch.negativeKeywords || [],
//         positiveKeywords: keywordResearch.positiveKeywords || [],
//         region: keywordResearch.region,
//         requestLanguage: keywordResearch.requestLanguage ?? 'en',
//         searchVolume: String(keywordResearch.searchVolume),
//         title: keywordResearch.title,
//         type: keywordResearch.type,
//       } as KeywordResearchFormInput;
//     }
//   },
//   regions: () => {
//     const { mode, keywordResearch } = get();

//     if (mode === 'create' || !keywordResearch || !keywordResearch.region)
//       return;
//     const reBuildedMap = new Map<number, string[]>(
//       keywordResearch.region.map((value, index) => [
//         index,
//         value.split(/\s*,\s*/).reverse(),
//       ])
//     );
//     useRegionStore.getState().hidrateFinalValue(reBuildedMap);
//   },
//   city: () => {
//     const { mode, keywordResearch } = get();

//     if (mode === 'create' || !keywordResearch || !keywordResearch.city) {
//       return [];
//     }

//     const citiesFromEntity = keywordResearch.city;

//     useRegionStore.getState().hidrateNegativeCities(citiesFromEntity);

//     return citiesFromEntity;
//   },
//   resetKeywordResearch: () => {
//     set({ keywordResearch: null });
//   },
// }));

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
      };
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
