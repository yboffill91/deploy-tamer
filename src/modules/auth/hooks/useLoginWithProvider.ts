import { FirebaseAuthRepository } from '@/infraestructure/repositorries';
import { useAsync } from './useAsync';

export function useLoginUserWithProvider() {
  const repo = new FirebaseAuthRepository();

  const { execute, data, loading, error } = useAsync(
    async (provider: 'google' | 'github' | 'facebook') => {
      return repo.loginWithProvider(provider);
    }
  );

  return {
    executeLoginWithProvider: execute,
    user: data,
    loading,
    error,
  };
}
