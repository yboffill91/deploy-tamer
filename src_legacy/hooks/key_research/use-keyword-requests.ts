import { useQuery } from "@tanstack/react-query";
import { keywordRequestApi } from "@/lib/api/keyword-request";
import { useKeywordRequestStore } from "@/stores/key_research/keyword-request-store";
import { KeywordRequest } from "@/types/keyword-request";
import { useEffect } from "react";

export const useKeywordRequests = (userId: number = 1) => {
  const { setRequests, setIsLoading, setError } = useKeywordRequestStore();

  const queryResult = useQuery<KeywordRequest[], Error>({
    queryKey: ["keywordRequests", userId],
    queryFn: () => keywordRequestApi.getAll(userId),
  });

  // Sincronizar el estado del store con el resultado del query
  useEffect(() => {
    setIsLoading(queryResult.isLoading);

    if (queryResult.data) {
      setRequests(queryResult.data);
    }

    if (queryResult.error) {
      setError("Failed to load keyword requests. Please try again later.");
    }
  }, [queryResult.data, queryResult.isLoading, queryResult.error, setRequests, setIsLoading, setError]);

  return queryResult;
};
