import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { KeywordResearchEntity } from '@/core/entities';
import { createDeleteMutation, keywordResearchKeys } from './queryFactory';

const repo = new KeywordResearchApiRepository();

export const useDeleteKeywordResearch =
  createDeleteMutation<KeywordResearchEntity>(
    keywordResearchKeys.list(),
    (id) => repo.delete(id),
    (entity) => String(entity.id)
  );
