import { FirebaseAuthRepository } from '@/infraestructure/repositories';
import { useAsync } from './useAsync';
import { RegisterUser } from '@/application/use-cases';

export function useRegisterUser() {
  const repo = new FirebaseAuthRepository();
  const registerUser = new RegisterUser(repo);

  const { execute, data, loading, error } = useAsync(
    registerUser.execute.bind(registerUser)
  );

  return {
    executeRegister: execute,
    user: data,
    loading,
    error,
  };
}
