// src/hooks/useAdminCRM.ts
"use client";

import { useApiGet } from "@/lib/api/use-api-get";
import type { CRMResponse } from "@/lib/api/types";
import { env } from "@/config/env";

export function useAdminCRM() {
  return useApiGet<CRMResponse>(`${env.api.url}/crm`);
}
