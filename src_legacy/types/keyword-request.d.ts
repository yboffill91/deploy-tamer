export interface KeywordRequest {
  keyword_request_id: number;
  keyword_request_title: string;
  keyword_request_positive_keyword: string[];
  keyword_request_extra_positive_keyword: string[];
  keyword_request_negative_keyword: string[];
  keyword_request_generated_positive_keyword: string[] | null;
  keyword_request_generated_negative_keyword: string[] | null;
  keyword_request_finished: string;
  keyword_request_type: string;
  keyword_request_status: "Draft" | "Created" | "In Progress" | "Finished" | "Cancelled";
  keyword_request_priority: string;
  company_company_id: number;
  user_user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// src/types/keywordRequest.ts
// src/types/keywordRequest.ts
export interface CreateKeywordRequest {
  // Campos obligatorios para la DB
  keyword_request_title: string;
  keyword_request_positive_keyword: string[];
  keyword_request_type: "Informational" | "Transactional";
  keyword_request_all_city: "Yes" | "No";
  keyword_request_status: "Draft" | "Created" | "In Progress" | "Finished" | "Cancelled";
  keyword_request_finished: "Yes" | "No";
  keyword_request_priority: "Yes" | "No";

  // Relaciones obligatorias si se va a insertar
  data_city_id?: string; // Add optional property
  keyword_name?: string; // Add optional property
  get_difference?: boolean;
  company_id: number; // <-- ahora obligatorio
  user_user_id: number; // <-- ahora obligatorio

  // Campos opcionales para la DB
  keyword_request_search_volume?: number | null;
  keyword_request_extra_positive_keyword?: string[];
  keyword_request_negative_keyword?: string[];
  keyword_request_generated_negative_keyword?: string[];
  keyword_request_generated_positive_keyword?: string[];
  keyword_request_generated_positive_keyword_full_info?: string[];
  keyword_request_city?: string[];
  keyword_request_region?: any[] | null;
  keyword_request_language?: string | null;
  keyword_request_brand?: any;
}

export interface KeywordSuggestionsResponse {
  success: boolean;
  data?: string | string[]; // String con palabras separadas por comas
  message?: string;
}

export interface SelectedLanguage {
  name: string;
  type: string;
}

export interface SelectedRegion {
  name: string;
  type: string;
}

export interface BrandFilter {
  [key: string]: {
    active: boolean;
    children: Array<{ name: string; active: boolean }>;
  };
}
