import { IRepository } from '@/core';
import { KeywordResearchDTO, CreateKeywordResearchDTO } from '@/core/dto';
import { KeywordResearchEntity } from '@/core/entities';
import {
  downloadExcelApi,
  googleSearchApi,
  keywordResearchApi,
} from '@/lib/apis';
import { fetchHelper } from '@/lib/fetch-helper';
import { SessionRepository } from './SessionRepository';
import { KeywordResearchFormInput } from '@/modules/tools/utils';

export class KeywordResearchApiRepository implements IRepository {
  private mapToDto(data: KeywordResearchDTO): Partial<KeywordResearchDTO> {
    return {
      title: data.title,
      searchVolume: data.searchVolume,
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
      result: data.result,
      tag: data.tag,
      status: data.status,
      requesterId: data.requesterId,
      price: data.price,
      tasks: data.tasks,
      createdAt: data.createdAt,
      deletedAt: data.deletedAt,
      organicResult: data.organicResult,
      organicResultFull: data.organicResultFull,
      id: data.id,
    };
  }

  private auth = async () => {
    const AuthRepo = new SessionRepository();
    const auth = await AuthRepo.autorization();
    return auth;
  };

  async findAll(): Promise<KeywordResearchEntity[]> {
    try {
      const response = await fetchHelper<CreateKeywordResearchDTO[]>(
        keywordResearchApi,
        {
          headers: {
            Authorization: `Bearer ${await this.auth()}`,
          },
        }
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
      const response = await fetchHelper<CreateKeywordResearchDTO>(
        keywordResearchApi + `/${id}`,
        {
          headers: {
            Authorization: `Bearer ${await this.auth()}`,
          },
        }
      );
      if (!response) {
        throw new Error("Error getting KeyWord Research's");
      }
      const sanitizedData: CreateKeywordResearchDTO = this.mapToDto(response);

      return Object.assign(new KeywordResearchEntity(), sanitizedData);
    } catch (error) {
      throw error;
    }
  }

  async create(data: KeywordResearchFormInput): Promise<void> {
    const payload = {
      title: data.title,
      searchVolume: Number(data.searchVolume),
      positiveKeywords: data.positiveKeywords as object,
      extraPositiveKeywords: data.extraPositiveKeywords as object,
      negativeKeywords: data.negativeKeywords as object,
      city: data.city as object,
      region: data.region as object,
      requestLanguage: data.requestLanguage === 'en' ? 'english' : 'español',
      brand: data.brand as object,
      type: data.type.toUpperCase(),
      allCitys: false,
    };
    try {
      const response = await fetchHelper(keywordResearchApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.auth()}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response) {
        throw new Error('Error creating new Keyword Research Report');
      }
    } catch (error) {
      throw error;
    }
  }
  async update(id: string, data: KeywordResearchDTO): Promise<void> {
    try {
      const response = await fetchHelper(keywordResearchApi + `/${id}`, {
        headers: {
          method: 'PATCH',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.auth()}`,
        },
        body: JSON.stringify(data),
      });
      if (!response) {
        throw new Error('Error creating new Keyword Research Report');
      }
    } catch (error) {
      throw error;
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await fetchHelper(keywordResearchApi + `/${id}`, {
        method: 'DELETE',

        headers: {
          Authorization: `Bearer ${await this.auth()}`,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async findByTag(tag: string): Promise<KeywordResearchEntity> {
    try {
      const response = await fetchHelper<CreateKeywordResearchDTO[]>(
        keywordResearchApi + `/${tag}`,
        {
          headers: {
            Authorization: `Bearer ${await this.auth()}`,
          },
        }
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
      const response = await fetchHelper<string>(googleSearchApi + `/${word}`, {
        headers: {
          Authorization: `Bearer ${await this.auth()}`,
        },
      });
      return response as string;
    } catch (error) {
      throw error;
    }
  }

  async exportExcel(id: string): Promise<void> {
    try {
      const token = await this.auth();

      const response = await fetch(`${downloadExcelApi}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error descargando el archivo: ${response.statusText}`);
      }

      const blob = await response.blob();

      let filename = 'Keyword_Research.xlsx';
      const contentDisposition = response.headers.get('content-disposition');

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);

      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando Excel:', error);
      throw error;
    }
  }
}
