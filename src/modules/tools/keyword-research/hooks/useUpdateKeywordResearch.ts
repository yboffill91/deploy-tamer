import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { CreateKeywordResearchDTO } from '@/core/dto';
import { createUpdateMutation, keywordResearchKeys } from './queryFactory';

const repo = new KeywordResearchApiRepository();

export const useUpdateKeywordResearch =
  createUpdateMutation<CreateKeywordResearchDTO>(
    [keywordResearchKeys.list()],
    (id, payload) => repo.update(id, payload)
  );
