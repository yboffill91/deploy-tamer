enum KeywordResearchType {
  INFORMATIONAL = "INFORMATIONAL",
  TRANSACTIONAL = "TRANSACTIONAL",
}

export class KeywordResearchEntity {
  readonly title?: string;
  readonly searchVolume?: number;
  readonly?: string[];
  readonly extraPositiveKeywords?: string[];
  readonly negativeKeywords?: string[];
  readonly generatedPositiveKeywords?: string[];
  readonly generatedNegativeKeywords?: string[];
  readonly city?: string[];
  readonly allCitys?: boolean;
  readonly region?: string[];
  readonly requestLanguage?: string;
  readonly brand?: string[];
  readonly type?: KeywordResearchType;
  readonly companyId?: number;
}
