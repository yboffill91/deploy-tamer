import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { negativeKeywordSIApi } from "@/lib/api/negative-keyword-si";
import { useNegativeKeywordSIStore } from "@/stores/key_research/negative-keyword-si-store";
import { CreateNegativeKeywordSIRequest, UpdateNegativeKeywordSIRequest } from "@/types/negative-keyword-si";

export const useNegativeKeywordsSI = () => {
  const { setNegativeKeywords, setIsLoading, setError } = useNegativeKeywordSIStore();

  const queryResult = useQuery({
    queryKey: ["negativeKeywordsSI"],
    queryFn: negativeKeywordSIApi.getAll,
  });

  useEffect(() => {
    if (queryResult.data) {
      setNegativeKeywords(queryResult.data);
      setIsLoading(false);
    }
  }, [queryResult.data, setNegativeKeywords, setIsLoading]);

  useEffect(() => {
    if (queryResult.error) {
      setError("Failed to load negative keywords. Please try again later.");
      setIsLoading(false);
    }
  }, [queryResult.error, setError, setIsLoading]);

  useEffect(() => {
    setIsLoading(queryResult.isLoading);
  }, [queryResult.isLoading, setIsLoading]);

  return queryResult;
};

export const useCreateNegativeKeywordSI = () => {
  const queryClient = useQueryClient();
  const { addKeyword } = useNegativeKeywordSIStore();

  return useMutation({
    mutationFn: (request: CreateNegativeKeywordSIRequest) => negativeKeywordSIApi.create(request),
    onSuccess: (newKeyword) => {
      addKeyword(newKeyword);
      queryClient.invalidateQueries({ queryKey: ["negativeKeywordsSI"] });
    },
  });
};

export const useUpdateNegativeKeywordSI = () => {
  const queryClient = useQueryClient();
  const { updateKeyword } = useNegativeKeywordSIStore();

  return useMutation({
    mutationFn: (request: UpdateNegativeKeywordSIRequest) => negativeKeywordSIApi.update(request),
    onSuccess: (updatedKeyword) => {
      updateKeyword(updatedKeyword.negative_keyword_by_si_id, updatedKeyword);
      queryClient.invalidateQueries({ queryKey: ["negativeKeywordsSI"] });
    },
  });
};

export const useDeleteNegativeKeywordSI = () => {
  const queryClient = useQueryClient();
  const { removeKeyword } = useNegativeKeywordSIStore();

  return useMutation({
    mutationFn: (keywordId: number) => negativeKeywordSIApi.delete(keywordId),
    onSuccess: (_, keywordId) => {
      removeKeyword(keywordId);
      queryClient.invalidateQueries({ queryKey: ["negativeKeywordsSI"] });
    },
  });
};
