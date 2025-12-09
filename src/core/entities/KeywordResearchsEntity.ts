export enum KeywordResearchType {
  INFORMATIONAL = 'INFORMATIONAL',
  TRANSACTIONAL = 'TRANSACTIONAL',
}

export class KeywordResearchEntity {
  readonly id?: number;
  readonly title?: string;
  readonly searchVolume?: number;

  readonly positiveKeywords?: string[];
  readonly extraPositiveKeywords?: string[];
  readonly negativeKeywords?: string[];
  readonly generatedPositiveKeywords?: KeywordResultEntity[];
  readonly generatedNegativeKeywords?: KeywordResultEntity[];

  readonly city?: string[];
  readonly allCitys?: boolean;
  readonly region?: string[];

  readonly requestLanguage?: string;
  readonly brand?: string[];
  readonly type?: KeywordResearchType;

  readonly companyId?: number;
  readonly tag?: string[];

  readonly generatedPositiveKeyWordFullInfo?: string | string[] | null;

  readonly status?: string;
  readonly requesterId?: number | null;
  readonly price?: number;

  readonly result?: KeywordResultEntity[] | null;

  readonly tasks?: string[];

  readonly createdAt?: Date;
  readonly deletedAt?: Date | null;

  readonly organicResult?: string | null;
  readonly organicResultFull?: OrganicResultFullEntity | null;
}

export interface KeywordResultEntity {
  readonly cpc?: number;
  readonly competition?: CompetitionLevel;
  readonly keyword?: string;
  readonly language_code?: string;
  readonly location_code?: number;
  readonly search_volume?: number;
  readonly search_partners?: boolean;

  readonly monthly_searches?: MonthlySearchEntity[];

  readonly competition_index?: number;
  readonly keyword_annotations?: KeywordAnnotationEntity | null;

  readonly low_top_of_page_bid?: number;
  readonly high_top_of_page_bid?: number;
}

export type CompetitionLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface MonthlySearchEntity {
  readonly year?: number;
  readonly month?: number;
  readonly search_volume?: number;
}

export interface KeywordAnnotationEntity {
  readonly concepts?: string[] | null;
}

export interface OrganicResultFullEntity {
  readonly type?: string;
  readonly items?: OrganicItemEntity[];
  readonly spell?: string | null;
  readonly keyword?: string;
  readonly datetime?: string;
  readonly check_url?: string;
  readonly se_domain?: string;
  readonly item_types?: string[];
  readonly items_count?: number;
  readonly pages_count?: number;
  readonly language_code?: string;
  readonly location_code?: number;
  readonly refinement_chips?: string;
  readonly se_results_count?: string;
}

export interface OrganicItemEntity {
  readonly url?: string;
  readonly page?: number;
  readonly type?: string;
  readonly title?: string;
  readonly domain?: string;
  readonly breadcrumb?: string;
  readonly rank_group?: number;
  readonly description?: string;
  readonly rank_absolute?: number;
}
