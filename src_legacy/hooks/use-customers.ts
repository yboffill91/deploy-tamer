// src/hooks/useCustomers.ts
"use client";

import { useMemo } from "react";
import { useApiGet } from "@/lib/api/use-api-get";
import type { CustomersResponse } from "@/lib/api/types";
import { env } from "@/config/env";

type Params = {
  page?: number;
  pageSize?: number;
  q?: string;
  [key: string]: string | number | undefined;
};

function toQueryString(params?: Params) {
  const qs = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function useCustomers(params?: Params) {
  const path = useMemo(() => `${env.api.url}/api/customers${toQueryString(params)}`, [params]);
  return useApiGet<CustomersResponse>(path, [params]);
}
