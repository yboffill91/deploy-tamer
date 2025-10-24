export interface NegativeKeywordSI {
  negative_keyword_by_si_id: number;
  negative_keyword_by_si_word: string;
  negative_keyword_by_si_intent: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface CreateNegativeKeywordSIRequest {
  negative_keyword_by_si_word: string;
  negative_keyword_by_si_intent: string;
}

export interface UpdateNegativeKeywordSIRequest {
  negative_keyword_by_si_id: number;
  negative_keyword_by_si_word: string;
  negative_keyword_by_si_intent: string;
}
