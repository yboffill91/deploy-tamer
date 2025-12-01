import { KeywordResearchEntity } from '@/core/entities';
import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { create } from 'zustand';

interface ResearchStore {
  allResearch: KeywordResearchEntity[];
  selectedResearch: KeywordResearchEntity;
  getAllResearch(): Promise<void>;
  setSelectedResearch(newResearch: KeywordResearchEntity): void;

  isLoadingResearchs: boolean;
  isErrorGettingResearch: string;
}

export const useResearchStore = create<ResearchStore>((set) => ({
  selectedResearch: null,
  allResearch: null,
  isLoadingResearchs: false,
  isErrorGettingResearch: '',
  setSelectedResearch: (newResearch) => set({ selectedResearch: newResearch }),
  getAllResearch: async () => {
    try {
      set({ isErrorGettingResearch: '' });
      set({ isLoadingResearchs: true });
      const REPO = new KeywordResearchApiRepository();
      const Data = await REPO.findAll();
      set({ allResearch: Data });
    } catch (error) {
      set({ isErrorGettingResearch: error });
    } finally {
      set({ isLoadingResearchs: false });
    }
  },
}));
