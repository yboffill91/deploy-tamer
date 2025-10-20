import { FirebaseAuthRepository } from '@/infraestructure/repositorries';
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
