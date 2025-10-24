"use client";

import { useState } from "react";
import { useAuthorizedFetch } from "./use-authorized-fetch";
import { env } from "@/config/env";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

export function useApiMutation<TResponse = any, TBody = any>() {
  const { fetchJson } = useAuthorizedFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function run(path: string, method: HttpMethod, body?: TBody): Promise<TResponse | null> {
    setLoading(true);
    setError(null);

    try {
      if (env.features.debugMode) {
        console.log(`🚀 ${method} Request:`, path, body);
      }

      const res = await fetchJson<TResponse>(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (env.features.debugMode) {
        console.log(`✅ ${method} Response:`, res);
      }

      return res;
    } catch (err) {
      setError(err as Error);

      if (env.features.debugMode) {
        console.error(`❌ ${method} Error:`, err);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }

  return { run, loading, error };
}
