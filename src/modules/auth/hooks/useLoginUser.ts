import { FirebaseAuthRepository } from '@/infraestructure/repositorries';
import { useAsync } from './useAsync';
import { LoginUser } from '@/application/use-cases';

export function useLoginUser() {
  const repo = new FirebaseAuthRepository();
  const loginUser = new LoginUser(repo);

  const { execute, data, loading, error } = useAsync(
    loginUser.execute.bind(loginUser)
  );

  return {
    executeLogin: execute,
    user: data,
    loading,
    error,
  };
}
