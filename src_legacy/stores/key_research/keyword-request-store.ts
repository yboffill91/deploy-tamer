import { create } from "zustand";
import { KeywordRequest } from "@/types/keyword-request";

interface KeywordRequestStore {
  requests: KeywordRequest[];
  isLoading: boolean;
  error: string;
  setRequests: (requests: KeywordRequest[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
}

export const useKeywordRequestStore = create<KeywordRequestStore>((set) => ({
  requests: [],
  isLoading: true,
  error: "",
  setRequests: (requests) => set({ requests }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
