// src/lib/api/negativeKeywordSI.ts
import {
  NegativeKeywordSI,
  CreateNegativeKeywordSIRequest,
  UpdateNegativeKeywordSIRequest,
} from "@/types/negative-keyword-si";
import { authorizedFetch } from "./use-authorized-fetch";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_KR_BASE_URL_API}/negative_keyword_by_si`;

export const negativeKeywordSIApi = {
  getAll: async (): Promise<NegativeKeywordSI[]> => {
    const result = await authorizedFetch<{ data: NegativeKeywordSI[] }>(API_BASE_URL, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: globalThis.location.origin,
      },
      credentials: "include",
    });

    return result.data;
  },

  create: async (request: CreateNegativeKeywordSIRequest): Promise<NegativeKeywordSI> => {
    const result = await authorizedFetch<{ data: NegativeKeywordSI }>(API_BASE_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: globalThis.location.origin,
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    return result.data;
  },

  update: async (request: UpdateNegativeKeywordSIRequest): Promise<NegativeKeywordSI> => {
    const result = await authorizedFetch<{ data: NegativeKeywordSI }>(API_BASE_URL, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: globalThis.location.origin,
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    return result.data;
  },

  delete: async (keywordId: number): Promise<void> => {
    await authorizedFetch<void>(`${API_BASE_URL}/${keywordId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: globalThis.location.origin,
      },
      credentials: "include",
    });
  },
};
