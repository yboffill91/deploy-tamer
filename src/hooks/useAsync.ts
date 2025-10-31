/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useCallback } from 'react';

export function useAsync<T>(asyncFunction: (...args: any[]) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err: any) {
        setError(err.message ?? 'Unexpected error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  return { execute, data, loading, error };
}
