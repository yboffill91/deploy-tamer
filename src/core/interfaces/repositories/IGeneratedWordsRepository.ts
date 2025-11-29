import { CreateSuggestDTO } from '@/core/dto';
import { SuggestedWordsEntity } from '@/core/entities';

export type Languages = 'english' | 'español';
export type Endpoint = '/brands' | '/words' | '/negativekeywords';

export interface IGeneratedRepository {
  getSugguest(
    keyword: CreateSuggestDTO,
    language: Languages,
    endpoint: Endpoint
  ): Promise<SuggestedWordsEntity | string[]>;
}
