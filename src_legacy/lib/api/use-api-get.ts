'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { env } from '@/config/env';

import { useAuthorizedFetch } from './use-authorized-fetch';

export function useApiGet<T>(path: string | null, deps: unknown[] = []) {
  const { fetchJson, token } = useAuthorizedFetch();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const stableKey = useMemo(() => path, [path, ...deps]);
  const abortRef = useRef<AbortController | null>(null);

  const run = async () => {
    if (!stableKey || !token) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);

    try {
      if (env.features.debugMode) {
        console.log('📥 Fetching data:', stableKey);
      }

      const d = await fetchJson<T>(stableKey, {
        signal: abortRef.current.signal,
      });

      setData(d);
      setError(null);

      if (env.features.debugMode) {
        console.log('✅ Data loaded successfully:', d);
      }

      toast.success('Datos cargados correctamente');
    } catch (err) {
      if ((err as any)?.name !== 'AbortError') {
        setError(err as Error);

        if (env.features.debugMode) {
          console.error('❌ Error loading data:', err);
        }

        toast.error(`Error cargando datos: ${(err as any)?.message || 'Desconocido'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    run();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableKey, token]);

  return { data, error, loading, refetch: run };
}
