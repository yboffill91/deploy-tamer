import { CreateSuggestDTO } from '@/core/dto';
import { Endpoint, Languages } from '@/core/interfaces';
import { SuggestWordsApi } from '@/infrastructure/repositories';
import { create } from 'zustand';

interface BrandStore {
  brands: string[];
  isLoading: boolean;
  isError: string;
  getSuggestedBrands(
    keywords: CreateSuggestDTO,
    language?: Languages,
    endpoint?: Endpoint
  ): Promise<void>;
  setBrands(keyword: string): void;
  setBrandsWithArray(keywords: string[]): void;
  deleteBrand(keyword: string): void;
}

export const useBrandStore = create<BrandStore>((set, get) => ({
  brands: [],
  isError: '',
  isLoading: false,

  getSuggestedBrands: async (
    keywords,
    language = 'english',
    endpoint = '/brands'
  ) => {
    const REPO = new SuggestWordsApi();

    try {
      set({ isLoading: true });
      set({ isError: '' });

      const Response = await REPO.getSugguest(keywords, language, endpoint);
      if (Array.isArray(Response)) {
        set({ brands: [...Response] });
        return;
      }

      set({ brands: [...Response.suggested_keywords] });
    } catch (error) {
      set({ isError: error });
    } finally {
      set({ isLoading: false });
    }
  },
  setBrands: (keyword) => {
    const { brands } = get();
    if (brands.includes(keyword)) {
      return;
    }
    set({ brands: [...brands, keyword] });
  },
  setBrandsWithArray: (newBrands) => {
    const { brands } = get();
    const newArr = [...new Set([...brands, ...newBrands])];
    set({ brands: [...newArr] });
  },
  deleteBrand: (keyword) => {
    const { brands } = get();
    const newBrands = brands.filter((word) => word !== keyword);
    set({ brands: newBrands });
  },
}));
