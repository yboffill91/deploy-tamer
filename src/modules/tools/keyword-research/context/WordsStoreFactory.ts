import { CreateSuggestDTO } from '@/core/dto';
import { Endpoint, Languages } from '@/core/interfaces';
import { SuggestWordsApi } from '@/infrastructure/repositories';
import { create } from 'zustand';

interface WordsStore {
  words: string[];
  isLoading: boolean;
  isError: string;
  isFinished: boolean;
  getSuggestedWords(
    keywords: CreateSuggestDTO,
    language?: Languages,
    endpointOverride?: Endpoint
  ): Promise<void>;
  addWord(keyword: string): void;
  addWords(keywords: string[]): void;
  deleteWord(keyword: string): void;
  resetWords(): void;
}

function createWordsStore(defaultEndpoint: Endpoint) {
  return create<WordsStore>((set, get) => ({
    words: [],
    isLoading: false,
    isError: '',
    isFinished: false,
    getSuggestedWords: async (
      keywords,
      language = 'english',
      endpointOverride
    ) => {
      const REPO = new SuggestWordsApi();
      const endpoint = endpointOverride ?? defaultEndpoint;

      try {
        set({ isLoading: true, isError: '' });
        set({ isFinished: false });

        const Response = await REPO.getSugguest(keywords, language, endpoint);

        if (Array.isArray(Response)) {
          set({ words: [...Response] });
          return;
        }

        set({ words: [...Response.suggested_keywords] });
        set({ isFinished: true });
      } catch (error) {
        set({ isError: error instanceof Error ? error.message : 'Error' });
      } finally {
        set({ isLoading: false });
      }
    },

    addWord: (keyword) => {
      const { words } = get();
      if (!words.includes(keyword)) {
        set({ words: [...words, keyword] });
      }
    },

    addWords: (newWords) => {
      const { words } = get();
      const merged = [...new Set([...words, ...newWords])];
      set({ words: merged });
    },

    deleteWord: (keyword) => {
      const { words } = get();
      set({ words: words.filter((w) => w !== keyword) });
    },
    resetWords: () => {
      set({ words: [] });
    },
  }));
}

export const useBrandStore = createWordsStore('/brands');
export const usePositiveStore = createWordsStore('/words');
export const useNegativeStore = createWordsStore('/negativekeywords');
export const useExtraPositiveStore = createWordsStore('/words');
