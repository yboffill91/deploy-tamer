import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { keywordResearchApi } from "@/lib/api/keyword-research";
import { useKeywordResearchStore } from "@/stores/key_research/keyword-research-store";
import { CreateKeywordRequest } from "@/types/keyword-request";
import { toast } from "sonner";

// src/hooks/key_research/useKeywordResearch.ts
export const useCreateKeywordResearch = () => {
  const router = useRouter();
  const {
    title,
    volume,
    searchType,
    targetKeywords,
    extraKeywords,
    negativeKeywords,
    brandFilters,
    cities,
    useAllCities,
    selectedLanguage,
    selectedRegion,
    resetForm,
  } = useKeywordResearchStore();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      // Validar campos requeridos
      if (!title.trim()) {
        throw new Error("Title is required");
      }

      if (targetKeywords.length === 0) {
        throw new Error("At least one target keyword is required");
      }

      // ✅ Convertir el searchType al formato que espera el backend
      const backendSearchType = searchType === "informational" ? "Informational" : "Transactional";

      const requestData: CreateKeywordRequest = {
        // ✅ Campos REQUERIDOS
        keyword_request_title: title.trim(),
        keyword_request_positive_keyword: targetKeywords,
        keyword_request_type: backendSearchType,
        keyword_request_all_city: useAllCities ? "Yes" : "No",
        keyword_request_status: "Created", // ✅ Estado inicial requerido
        keyword_request_finished: "No", // ✅ Campo requerido
        keyword_request_priority: "No", // ✅ Campo requerido

        // ✅ Campos opcionales
        keyword_request_search_volume: volume ? parseInt(volume.toString(), 10) : null,
        keyword_request_extra_positive_keyword: extraKeywords,
        keyword_request_negative_keyword: negativeKeywords,
        keyword_request_city: cities || [],
        keyword_request_region:
          selectedRegion && selectedRegion.length > 0
            ? selectedRegion.map((region) => ({
                name: region.name,
                type: region.type,
              }))
            : null,
        keyword_request_language: selectedLanguage?.name || null,
        keyword_request_brand: brandFilters || {},

        // ✅ Relaciones (ajusta estos IDs según tu autenticación)
        company_id: 1,
        user_user_id: 1,
      };

      console.log("📤 Sending to API:", JSON.stringify(requestData, null, 2));

      await keywordResearchApi.create(requestData);
    },
    onSuccess: () => {
      resetForm();
      router.push("/admin/seo/requests");
    },
    onError: (error: Error) => {
      console.error("Error creating keyword research:", error);
      toast.error(`Failed to process keyword research: ${error.message}`);
    },
  });
};
