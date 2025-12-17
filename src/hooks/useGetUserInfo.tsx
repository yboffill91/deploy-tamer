'use client';

import { useEffect, useState } from 'react';
import { SessionRepository } from '@/infrastructure/repositories';
import { ResponseUsersDTO } from '@/core';

export function useGetUserInfo() {
  const [user, setUser] = useState<ResponseUsersDTO | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
        try {
        setLoading(true)
        const repo = new SessionRepository();
        const user = await repo.getUser();
        setUser(user);
      } catch (e) {
        setError(e instanceof Error ? 'Error loading user session' : e.message);
        } finally {

            setLoading(false)
        }
    };

    loadUser();
  }, []);

  return { user, error, loading };
}
