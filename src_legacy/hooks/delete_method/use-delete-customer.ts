import { env } from '@/config/env';
import { useApiMutation } from '@/lib/api/use-api-mutation';

export function useDeleteCustomer() {
  const { run, loading, error } = useApiMutation();

  async function deleteCustomer(id: number) {
    return await run(`${env.api}/customer/${id}`, 'DELETE');
  }

  return { deleteCustomer, loading, error };
}
