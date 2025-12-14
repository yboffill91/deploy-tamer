import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from '@tanstack/react-query';



export function createListQuery<T>(
  queryKey: QueryKey,
  fetcher: () => Promise<T[]>
) {
  return function useList() {
    return useQuery({
      queryKey,
      queryFn: fetcher,
      staleTime: 1000 * 5,
      refetchOnWindowFocus: false,
      
    });
  };
}


export function createDeleteMutation<T>(
  queryKey: QueryKey,
  deleter: (id: string) => Promise<void>,
  getId: (entity: T) => string
) {
  return function useDelete() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: deleter,

      onMutate: async (id: string) => {
        await queryClient.cancelQueries({ queryKey });

        const previous = queryClient.getQueryData<T[]>(queryKey);

        queryClient.setQueryData<T[]>(queryKey, (old) =>
          old?.filter((item) => getId(item) !== id)
        );

        return { previous };
      },

      onError: (_err, _id, ctx) => {
        queryClient.setQueryData(queryKey, ctx?.previous);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });
  };
}


export function createInvalidateMutation(
  queryKey: QueryKey,
  action: (id: string) => Promise<unknown>
) {
  return function useAction() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: action,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });
  };
}


export function createUpdateMutation<TUpdate>(
  invalidateKeys: QueryKey[],
  updater: (id: string, payload: Partial<TUpdate>) => Promise<unknown>
) {
  return function useUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Partial<TUpdate>;
      }) => updater(id, payload),

      onSuccess: () => {
        invalidateKeys.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        );
      },
    });
  };
}





// ----> React Query keys List

export const keywordResearchKeys = {
  all: ['keyword-research'] as const,
  list: () => [...keywordResearchKeys.all, 'list'] as const,
  detail: (id: string) => [...keywordResearchKeys.all, 'detail', id] as const,
  results: (id: string) => [...keywordResearchKeys.all, 'results', id] as const,
};