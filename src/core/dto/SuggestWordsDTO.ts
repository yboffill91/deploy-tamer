export class SuggestedWordsDTO {
  readonly suggested_keywords?: string[];
  readonly main_category?: string;
  readonly seo_intent?: string;
}

export class CreateSuggestDTO {
  constructor(readonly keywords: string[]) {}
}
