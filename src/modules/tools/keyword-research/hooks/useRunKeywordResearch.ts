import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { createInvalidateMutation, keywordResearchKeys } from './queryFactory';

const repo = new KeywordResearchApiRepository();

export const useRunKeywordResearch = createInvalidateMutation(
  keywordResearchKeys.list(),
  (id) => repo.runKeyword(id)
);
