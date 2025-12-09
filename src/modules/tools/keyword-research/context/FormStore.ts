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
  // regions: () => void;
  city: () => void;
}

export const useFormStore = create<FormStore>((set, get) => ({
  mode: 'create',
  keywordResearch: null,
  error: '',
  isLoading: false,

  setMode: (mode) => {
    set({ mode });
  },

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
        requestLanguage: 'EN',
        searchVolume: '0',
        title: '',
        type: 'TRANSACTIONAL',
      };
    }

    // const reBuildedRegions = keywordResearch.region!.flatMap((value) =>
    //   value.split(/\s*,\s*/)
    // );

    return {
      allCitys: keywordResearch.allCitys || false,
      brand: keywordResearch.brand || [],
      city: keywordResearch.city || [],
      companyId: keywordResearch.companyId,
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
  // regions: () => {
  //   const { mode, keywordResearch } = get();

  //   if (mode === 'create' || !keywordResearch || !keywordResearch.region)
  //     return;

  //   // 1. Reconstruir el Map a partir del arreglo de strings de la API
  //   // El .reverse() es CRUCIAL aquí para que coincida con la lógica de .toReversed()
  //   // que usas en setFinalValue.
  //   const reBuildedMap = new Map<number, string[]>(
  //     keywordResearch.region.map((value, index) => [
  //       index,
  //       value.split(/\s*,\s*/).reverse(),
  //     ])
  //   );

  //   // 2. Hidratar la useRegionStore
  //   useRegionStore.getState().hidrateFinalValue(reBuildedMap);
  // },
  city: () => {
    const { mode, keywordResearch } = get();

    if (mode === 'create' || !keywordResearch || !keywordResearch.city) {
      // Si estamos creando o no hay data, devolvemos un arreglo vacío.
      return [];
    }

    const citiesFromEntity = keywordResearch.city;

    // 1. Hidratar la useRegionStore:
    // Llamamos directamente a la función que maneja el estado de ciudades negativas
    // (Asumimos que necesitas un hidrateNegativeCities en useRegionStore)
    useRegionStore.getState().hidrateNegativeCities(citiesFromEntity);

    // 2. Devolver el valor para que sea usado en getInitialValues (para RHF)
    return citiesFromEntity;
  },
}));
