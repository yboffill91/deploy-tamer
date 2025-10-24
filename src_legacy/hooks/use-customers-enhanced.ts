"use client";

import { useEffect, useState, useMemo } from "react";
import { useCustomers } from "@/hooks/use-customers";
import { cacheService } from "@/lib/cache";
import { CustomersResponse } from "@/lib/api/types";

export function useCustomersEnhanced(params?: any) {
  const { data, error, loading, refetch } = useCustomers(params);
  const cacheKey = "customers";
  const [_, forceUpdate] = useState(0);

  const cachedData = cacheService.get(cacheKey) as CustomersResponse | undefined;

  useEffect(() => {
    return cacheService.subscribe(cacheKey, () => {
      forceUpdate((n) => n + 1);
    });
  }, [cacheKey]);

  useEffect(() => {
    if (data) {
      cacheService.set(cacheKey, data);
    }
  }, [data]);

  // ✅ Normaliza garantizando siempre CustomersResponse
  const normalizedData: CustomersResponse | undefined = useMemo(() => {
    if (cachedData) {
      if (Array.isArray(cachedData)) {
        // caso raro si algún hook devuelve array directo
        return { customers: cachedData, total: cachedData.length };
      }
      if ("customers" in cachedData) {
        return cachedData; // ya está en la forma correcta
      }
    }
    if (data) {
      if (Array.isArray(data)) {
        return { customers: data, total: data.length };
      }
      if ("customers" in data) {
        return data as CustomersResponse;
      }
    }
    return undefined;
  }, [cachedData, data]);

  return {
    data: normalizedData,
    error,
    loading: loading && !cachedData,
    refetch: async () => {
      cacheService.clear(cacheKey);
      return refetch();
    },
    isCached: !!cachedData,
  };
}
