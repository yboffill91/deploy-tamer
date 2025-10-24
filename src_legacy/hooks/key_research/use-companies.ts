import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "@/lib/api/companies";
import { useCompanyStore } from "@/stores/key_research/company-store";
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from "@/types/companies";

export const useCompanies = () => {
  const { setCompanies } = useCompanyStore();

  return useQuery<Company[], Error>({
    queryKey: ["companies"],
    queryFn: companyApi.getAll,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const { addCompany } = useCompanyStore();

  return useMutation<Company, Error, CreateCompanyRequest>({
    mutationFn: companyApi.create,
    onSuccess: (newCompany) => {
      addCompany(newCompany);
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const { updateCompany } = useCompanyStore();

  return useMutation<Company, Error, UpdateCompanyRequest>({
    mutationFn: companyApi.update,
    onSuccess: (updatedCompany) => {
      updateCompany(updatedCompany.id, updatedCompany);
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const { removeCompany } = useCompanyStore();

  return useMutation<void, Error, number>({
    mutationFn: companyApi.delete,
    onSuccess: (_, companyId) => {
      removeCompany(companyId);
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
