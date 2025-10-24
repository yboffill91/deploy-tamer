"use client";

import { useEffect, useState } from "react";
import { useAdminGeneral } from "@/hooks/use-admin-general";
import { cacheService } from "@/lib/cache";
import { GeneralResponse } from "@/lib/api/types";

export function useAdminGeneralEnhanced() {
  const { data, error, loading, refetch } = useAdminGeneral();
  const cacheKey = "admin_general";
  const [_, forceUpdate] = useState(0);

  const cachedData = cacheService.get<GeneralResponse>(cacheKey);

  useEffect(() => {
    return cacheService.subscribe(cacheKey, () => {
      forceUpdate((n) => n + 1);
    });
  }, [cacheKey]);

  useEffect(() => {
    if (data) {
      const prev = cacheService.get<GeneralResponse>(cacheKey) || {};
      cacheService.set<GeneralResponse>(cacheKey, { ...prev, ...data });
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
  };
}
