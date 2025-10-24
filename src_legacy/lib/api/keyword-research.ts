// src/lib/api/keywordResearch.ts
import { CreateKeywordRequest, KeywordRequest, KeywordSuggestionsResponse } from "@/types/keyword-request";
import { authorizedFetch } from "./use-authorized-fetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_KR_BASE_URL;

export const keywordResearchApi = {
  // ✅ Crear keyword request enviando los campos exactos que el backend espera
  create: async (request: CreateKeywordRequest): Promise<KeywordRequest> => {
    // ✅ Validar que haya al menos un positive keyword
    if (!request.keyword_request_positive_keyword || request.keyword_request_positive_keyword.length === 0) {
      throw new Error("Debe incluir al menos un Positive Keyword");
    }

    return await authorizedFetch<KeywordRequest>(`${API_BASE_URL}/keyword_request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keyword_request_title: request.keyword_request_title,
        keyword_request_positive_keyword: request.keyword_request_positive_keyword,
        keyword_request_extra_positive_keyword: request.keyword_request_extra_positive_keyword || [],
        keyword_request_negative_keyword: request.keyword_request_negative_keyword || [],
        company_company_id: request.company_id,
        user_user_id: request.user_user_id,
        get_difference: request.get_difference ?? false,
        keyword_request_type: request.keyword_request_type,
        keyword_request_all_city: request.keyword_request_all_city,
        keyword_request_status: request.keyword_request_status,
        keyword_request_finished: request.keyword_request_finished,
        keyword_request_priority: request.keyword_request_priority,
        keyword_request_city: request.keyword_request_city,
        keyword_request_region: request.keyword_request_region,
        keyword_request_language: request.keyword_request_language,
        keyword_request_brand: request.keyword_request_brand,
      }),
    });
  },
  // ✅ Obtener sugerencias (similar/negative)
  getSuggestions: async (keywords: string[], type: "similar" | "negative"): Promise<string[]> => {
    const endpoint = type === "similar" ? "similar" : "negative";
    const params = new URLSearchParams();
    keywords.forEach((keyword) => params.append("keywords", keyword));

    const response = await authorizedFetch<KeywordSuggestionsResponse>(
      `${API_BASE_URL}/ai/${endpoint}?${params.toString()}`,
      { method: "GET", headers: { Accept: "application/json" } },
    );

    if (!response?.data) return [];

    let suggestions: string[] = [];
    if (typeof response.data === "string") {
      suggestions = response.data
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s !== "null");
    } else if (Array.isArray(response.data)) {
      suggestions = response.data.map((item) => String(item).trim()).filter((s) => s.length > 0 && s !== "null");
    }

    return suggestions;
  },

  // ✅ Obtener sugerencias de marcas
  getBrandSuggestions: async (keywords: string[], language?: string, region?: any): Promise<any> => {
    const params = new URLSearchParams();
    keywords.forEach((keyword) => params.append("keywords", keyword));
    if (language) params.append("language", language);
    if (region) params.append("region", JSON.stringify(region));

    return await authorizedFetch<any>(`${API_BASE_URL}/ai/brand_selection?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  },

  // ✅ Test de conexión
  testConnection: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      return response.ok
        ? { success: true, message: "Connection successful" }
        : { success: false, message: `HTTP ${response.status}: ${response.statusText}` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },
};
