import { KeywordResultEntity } from '../entities';

export class CreateKeywordResearchDTO {
  readonly title?: string;
  readonly searchVolume?: number;
  readonly positiveKeywords?: string[];
  readonly negativeKeywords?: string[];
  readonly generatedPositiveKeywords?: KeywordResultEntity[] | {};
  readonly generatedNegativeKeywords?: KeywordResultEntity[] | {};
  readonly city?: string[];
  readonly allCitys?: boolean;
  readonly region?: string[];
  readonly requestLanguage?: string;
  readonly brand?: string[];
  readonly type?: string;
  readonly companyId?: number;
}

export class KeywordResearchDTO extends CreateKeywordResearchDTO {
  readonly id?: number;
  readonly tag?: string[];
  readonly generatedPositiveKeyWordFullInfo?: string | string[] | null;
  readonly status?: string;
  readonly requesterId?: number | null;
  readonly price?: number;
  readonly result?: ResponseResultDTO | null;
  readonly tasks?: string[];
  readonly createdAt?: Date;
  readonly deletedAt?: Date | null;
  readonly organicResult?: string | null;
  readonly organicResultFull?: OrganicResultFull | null;
}

// interface Result {
//   cpc: number;
//   keyword: string;
//   language_code: string;
//   location_code: number;
//   search_volume: number;
//   search_partners: boolean;
//   monthy_searches: {
//     year: number;
//     month: number;
//     search_volume: number;
//   }[];
// }

export class ResultsDTO {
  readonly cpc?: number;
  readonly keyword?: string;
  readonly language_code?: string;
  readonly location_code?: number;
  readonly search_volume?: number;
  readonly search_partners?: boolean;
  readonly monthy_searches?: monthleSearches;
}

export class ResponseResultDTO {
  readonly result?: ResultsDTO[];
}

interface monthleSearches {
  year: number;
  month: number;
  search_volume: number;
}

interface OrganicResultFull {
  type: string;
  items: {
    url: string;
    page: number;
    type: string;
    title: string;
    domain: string;
    breadcrumb: string;
    rank_group: number;
    description: string;
    rank_absolute: number;
  }[];
  spell: string | null;
  keyword: string;
  datetime: string;
  check_url: string;
  se_domain: string;
  item_types: string[];
  items_count: number;
  pages_count: number;
  language_code: string;
  location_code: number;
  refinement_chips: string;
  se_results_count: string;
}
