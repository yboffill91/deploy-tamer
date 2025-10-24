import { FirebaseAuthRepository } from '@/infraestructure/repositories';
import { useAsync } from './useAsync';
import { ResetPassword } from '@/application/use-cases';
import { Email } from '@/core';

export function useResetPassword() {
  const repo = new FirebaseAuthRepository();
  const resetPassword = new ResetPassword(repo);

  const { execute, loading, error } = useAsync(async (email: string) => {
    await resetPassword.execute(new Email(email));
  });

  return { executeResetPassword: execute, loading, error };
}
