import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { KeywordResearchEntity } from '@/core/entities';
import { createListQuery, keywordResearchKeys } from './queryFactory';

const repo = new KeywordResearchApiRepository();

export const useKeywordResearchList = createListQuery<KeywordResearchEntity>(
  keywordResearchKeys.list(),
  () => repo.findAll()
);
