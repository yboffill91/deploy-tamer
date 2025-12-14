import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { createInvalidateMutation, keywordResearchKeys } from './queryFactory';

const repo = new KeywordResearchApiRepository();

export const useForceEndKeywordResearch = createInvalidateMutation(
  keywordResearchKeys.list(),
  (id) => repo.forceEnd(id)
);
