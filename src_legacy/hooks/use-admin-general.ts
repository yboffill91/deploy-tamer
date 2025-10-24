// src/hooks/useAdminGeneral.ts
"use client";

import { useApiGet } from "@/lib/api/use-api-get";
import type { GeneralResponse } from "@/lib/api/types";
import { env } from "@/config/env";

export function useAdminGeneral() {
  return useApiGet<GeneralResponse>(`${env.api.url}/api/general`);
}
