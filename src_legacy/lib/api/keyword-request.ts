// src/lib/api/keywordRequest.ts
import { KeywordRequest } from "@/types/keyword-request";
import { authorizedFetch } from "./use-authorized-fetch";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_KR_BASE_URL}/keyword_request`;

export const keywordRequestApi = {
  getAll: async (userId: number = 1): Promise<KeywordRequest[]> => {
    const result = await authorizedFetch<{ data: KeywordRequest[] }>(`${API_BASE_URL}?user_user_id=${userId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: globalThis.location.origin,
      },
      credentials: "include",
    });

    return result.data;
  },

  getById: async (requestId: number): Promise<KeywordRequest> => {
    const result = await authorizedFetch<{ data: KeywordRequest }>(`${API_BASE_URL}/${requestId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: globalThis.location.origin,
      },
      credentials: "include",
    });

    return result.data;
  },
};
