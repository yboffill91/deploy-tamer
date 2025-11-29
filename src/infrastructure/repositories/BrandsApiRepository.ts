import { CreateSuggestDTO, SuggestedWordsDTO } from '@/core/dto';
import { SuggestedWordsEntity } from '@/core/entities';
import { Endpoint, IGeneratedRepository, Languages } from '@/core/interfaces';
import { suggestWordsApi } from '@/lib/apis';
import { fetchHelper } from '@/lib/fetch-helper';

export class SuggestWordsApi implements IGeneratedRepository {
  async getSugguest(
    keyword: CreateSuggestDTO,
    language: Languages,
    endpoint: Endpoint
  ): Promise<SuggestedWordsEntity | string[]> {
    try {
      const Response = await fetchHelper<SuggestedWordsDTO | []>(
        suggestWordsApi + endpoint + `/${language}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
          body: JSON.stringify(keyword),
        }
      );
      console.log('Response :', Response);

      if (!Response) throw new Error('Error genereting sugguested words');
      if (Array.isArray(Response)) return Response;
      return Object.assign(new SuggestedWordsEntity(), Response);
    } catch (error) {
      throw error;
    }
  }
}
