import { KeywordResearchEntity } from '@/core/entities';
import { create } from 'zustand';

interface ResearchStore {
  selectedResearch: KeywordResearchEntity;
  setSelectedResearch(newResearch: KeywordResearchEntity): void;
}

export const useResearchStore = create<ResearchStore>((set) => ({
  selectedResearch: null,
  setSelectedResearch: (newResearch) => set({ selectedResearch: newResearch }),
}));
