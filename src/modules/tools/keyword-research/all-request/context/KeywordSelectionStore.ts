import { createSelectionStore } from '@/components/data-table/store/CreateSelectionStore';
import { KeywordResultEntity } from '@/core/entities';

export const useKeywordStore = createSelectionStore<KeywordResultEntity>();
