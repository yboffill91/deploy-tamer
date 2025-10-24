import { FirebaseAuthRepository } from '@/infraestructure/repositories';
import { useAsync } from './useAsync';

export function useRegisterUserWithProvider() {
  const repo = new FirebaseAuthRepository();

  const { execute, data, loading, error } = useAsync(
    async (provider: 'google' | 'github' | 'facebook') => {
      return repo.loginWithProvider(provider);
    }
  );

  return {
    executeRegisterWithProvider: execute,
    user: data,
    loading,
    error,
  };
}
