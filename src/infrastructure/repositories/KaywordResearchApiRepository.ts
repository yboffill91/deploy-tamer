import { IRepository } from "@/core";
import { KeywordResearchDTO, ResponseKeywordResearchDTO } from "@/core/dto";
import { KeywordResearchEntity } from "@/core/entities";
import { keywordResearchApi } from "@/lib/apis";
import { fetchHelper } from "@/lib/fetch-helper";

export class KeywordResearchApiRepository implements IRepository {
  private mapToDto(data: ResponseKeywordResearchDTO): KeywordResearchDTO {
    return {
      title: data.title!,
      searchVolume: data.searchVolume!,
      positiveKeywords: data.positiveKeywords,
      extraPositiveKeywords: data.extraPositiveKeywords,
      negativeKeywords: data.negativeKeywords,
      generatedPositiveKeywords: data.generatedPositiveKeywords,
      generatedNegativeKeywords: data.generatedNegativeKeywords,
      city: data.city,
      region: data.region,
      requestLanguage: data.requestLanguage,
      brand: data.brand,
      type: data.type,
      companyId: data.companyId,
    };
  }

  async findAll(): Promise<KeywordResearchEntity[]> {
    try {
      const response = await fetchHelper<ResponseKeywordResearchDTO[]>(
        keywordResearchApi
      );
      if (!response) {
        throw new Error("Error getting KeyWords Research's");
      }
      const sanitizedData: KeywordResearchDTO[] = response.map((res) =>
        this.mapToDto(res)
      );
      return sanitizedData.map((data) =>
        Object.assign(new KeywordResearchEntity(), data)
      );
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<KeywordResearchEntity> {
    try {
      const response = await fetchHelper<ResponseKeywordResearchDTO[]>(
        keywordResearchApi + `/${id}`
      );
      if (!response) {
        throw new Error("Error getting KeyWord Research's");
      }
      const sanitizedData: KeywordResearchDTO[] = response.map((res) =>
        this.mapToDto(res)
      );
      return Object.assign(new KeywordResearchEntity(), sanitizedData);
    } catch (error) {
      throw error;
    }
  }

  async create(data: KeywordResearchDTO): Promise<void> {
    try {
      const response = await fetchHelper(keywordResearchApi, {
        headers: {
          method: "POST",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response) {
        throw new Error("Error creating new Keyword Research Report");
      }
    } catch (error) {
      throw error;
    }
  }
  async update(id: string, data: KeywordResearchDTO): Promise<void> {
    try {
      const response = await fetchHelper(keywordResearchApi + `/${id}`, {
        headers: {
          method: "PATCH",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response) {
        throw new Error("Error creating new Keyword Research Report");
      }
    } catch (error) {
      throw error;
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await fetchHelper(keywordResearchApi + `/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      throw error;
    }
  }
  async findByTag(tag: string): Promise<KeywordResearchEntity> {
    try {
      const response = await fetchHelper<ResponseKeywordResearchDTO[]>(
        keywordResearchApi + `/${tag}`
      );
      if (!response) {
        throw new Error("Error getting KeyWord Research's");
      }
      const sanitizedData: KeywordResearchDTO[] = response.map((res) =>
        this.mapToDto(res)
      );
      return Object.assign(new KeywordResearchEntity(), sanitizedData);
    } catch (error) {
      throw error;
    }
  }
  async googleSearchWord(word: string): Promise<string> {
    try {
      const response = await fetchHelper(
        keywordResearchApi + `/google/search/${word}`
      );
      return response as string;
    } catch (error) {
      throw error;
    }
  }
}
