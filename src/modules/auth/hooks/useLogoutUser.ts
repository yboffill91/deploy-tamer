import { FirebaseAuthRepository } from '@/infraestructure/repositories';
import { LogoutUser } from '@/application/use-cases';
import { useAsync } from './useAsync';

export function useLogoutUser() {
  const repo = new FirebaseAuthRepository();
  const logoutUser = new LogoutUser(repo);

  const { execute, loading, error } = useAsync(() => logoutUser.execute());

  return {
    executeLogout: execute,
    loading,
    error,
  };
}
