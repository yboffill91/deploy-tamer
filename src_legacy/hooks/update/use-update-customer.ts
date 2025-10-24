// hooks/update/useUpdateCustomer.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Customer } from "@/lib/api/types";
import { customerApi } from "@/lib/api/customer";
import { useCustomerStore } from "@/stores/use-customer-store"; // ✅ Importar store

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { updateCustomer } = useCustomerStore(); // ✅ Usar store

  const mutation = useMutation({
    mutationFn: async (data: Partial<Customer>): Promise<Customer> => {
      const response = await customerApi.updateCustomer(data);
      return response;
    },

    onSuccess: (updatedCustomer, variables) => {
      // ✅ Actualizar el store de Zustand con los nuevos datos
      updateCustomer(variables);

      // ✅ Invalidar query de React Query
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });

  return {
    updateCustomer: mutation.mutate,
    updateCustomerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}
