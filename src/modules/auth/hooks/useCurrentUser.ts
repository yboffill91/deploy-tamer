'use client';
import { useEffect } from 'react';
import { useAsync } from './useAsync';
import { FirebaseAuthRepository } from '@/infraestructure/repositorries';
import { GetCurrentUser } from '@/application/use-cases';
import type { User } from '@/core';

export function useCurrentUser() {
  const repo = new FirebaseAuthRepository();
  const getCurrentUser = new GetCurrentUser(repo);

  const { execute, data, loading, error } = useAsync<User | null>(() =>
    getCurrentUser.execute()
  );

  useEffect(() => {
    execute();
  }, []);

  const refreshUser = async () => {
    return execute();
  };

  return {
    user: data,
    loading,
    error,
    refreshUser,
  };
}
