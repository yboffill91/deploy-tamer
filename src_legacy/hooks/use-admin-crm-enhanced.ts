"use client";

import { useEffect, useState } from "react";
import { useAdminCRM } from "@/hooks/use-admin-crm";
import { cacheService } from "@/lib/cache";
import { CRMResponse } from "@/lib/api/types";

export function useAdminCRMEnhanced() {
  const { data, error, loading, refetch } = useAdminCRM();
  const cacheKey = "admin_crm";
  const [_, forceUpdate] = useState(0);

  const cachedData = cacheService.get<CRMResponse>(cacheKey);

  useEffect(() => {
    return cacheService.subscribe(cacheKey, () => {
      forceUpdate((n) => n + 1);
    });
  }, [cacheKey]);

  useEffect(() => {
    if (data) {
      const prev: Partial<CRMResponse> = cacheService.get(cacheKey) || {};
      cacheService.set(cacheKey, { ...prev, ...data });
    }
  }, [data]);

  return {
    data: cachedData || data,
    error,
    loading: loading && !cachedData,
    refetch: async () => {
      cacheService.clear(cacheKey);
      return refetch();
    },
    isCached: !!cachedData,
  } as {
    data?: CRMResponse;
    error: unknown;
    loading: boolean;
    refetch: () => Promise<any>;
    isCached: boolean;
  };
}
