export class KeywordResearchDTO {
  readonly title?: string;
  readonly searchVolume?: number;
  readonly positiveKeywords?: string[];
  readonly extraPositiveKeywords?: string[];
  readonly negativeKeywords?: string[];
  readonly generatedPositiveKeywords?: string[];
  readonly generatedNegativeKeywords?: string[];
  readonly city?: string[];
  readonly allCitys?: boolean;
  readonly region?: string[];
  readonly requestLanguage?: string;
  readonly brand?: string[];
  readonly type?: string;
  readonly companyId?: number;
}

export class ResponseKeywordResearchDTO extends KeywordResearchDTO {
  readonly id?: number;
  readonly tag?: string[];
  readonly generatedPositiveKeyWordFullInfo?: string | string[] | null;
  readonly status?: string;
  readonly requesterId?: number | null;
  readonly price?: number;
  readonly result?: string | null;
  readonly tasks?: string[];
  readonly createdAt?: Date;
  readonly deletedAt?: Date | null;
}
