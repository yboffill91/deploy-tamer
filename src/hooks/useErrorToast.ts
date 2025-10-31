'use client';

import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export function useErrorToast(error: string | null) {
  const previousErrorRef = useRef<string | null>(null);

  useEffect(() => {
    const hadNoError = previousErrorRef.current === null;
    const hasErrorNow = error !== null;

    if (hadNoError && hasErrorNow) {
      toast.error(error);
    }

    previousErrorRef.current = error;
  }, [error]);
}
