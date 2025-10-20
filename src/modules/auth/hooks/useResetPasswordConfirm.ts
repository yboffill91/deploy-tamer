import { useAsync } from './useAsync';
import { FirebaseAuthRepository } from '@/infraestructure/repositorries';
import { ResetPasswordConfirm } from '@/application/use-cases';

export function useResetPasswordConfirm() {
  const repo = new FirebaseAuthRepository();
  const resetPasswordConfirm = new ResetPasswordConfirm(repo);

  const { execute, loading, error, data } = useAsync(
    resetPasswordConfirm.execute.bind(resetPasswordConfirm)
  );

  return {
    confirmPassword: execute,
    loading,
    error,
    data,
  };
}
