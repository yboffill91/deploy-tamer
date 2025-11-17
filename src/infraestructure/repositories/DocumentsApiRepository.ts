import { IRepository } from "@/core";
import { DocumentsDTO } from "@/core/dto/DocumentsDTO";
import { DocumentsEntity } from "@/core/entities";
import { documentsApi } from "@/lib/apis";
import { fetchHelper } from "@/lib/fetch-helper";

export class DocumentsApiRepository implements IRepository {

  async findAll(): Promise<DocumentsEntity[]> {


    try {
      const response = await fetchHelper<DocumentsDTO[]>(documentsApi);
      if (!response) {
        throw new Error(' Error fetching Documents')
      }
      const Documents = response.map((doc) => (Object.assign(new DocumentsEntity, doc)))
      return Documents;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error fetching Documents');
    }
  }

  async findById(id: string): Promise<DocumentsEntity> {
    try {
      const response = await fetchHelper<DocumentsDTO>(documentsApi + `/${id}`);
      if (!response) {
        throw new Error(' Error fetching Documents')
      }
      const Document = Object.assign(new DocumentsEntity, response)
      return Document;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error fetching Documents');
    }

  }

  async create(data: DocumentsDTO): Promise<DocumentsEntity> {
    try {
      const response = await fetchHelper<DocumentsDTO>(documentsApi + '/upload/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response) {
        throw new Error(' Error creating Documents')
      }
      const Document = Object.assign(new DocumentsEntity, response)
      return Document;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error creating Documents');
    }
  }

  async update(id: string, data: DocumentsDTO): Promise<DocumentsEntity> {
    try {
      const response = await fetchHelper<DocumentsDTO>(documentsApi + `/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      if (!response) {
        throw new Error(' Error updating Documents')
      }
      const Document = Object.assign(new DocumentsEntity, response)
      return Document;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error updating Documents');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await fetchHelper(documentsApi + `/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error deleting Documents');
    }
  }

  async findByFileName(fileName: string): Promise<DocumentsEntity[]> {
    try {
      const response = await fetchHelper<DocumentsDTO[]>(documentsApi + `?fileName=${fileName}`);
      if (!response) {
        throw new Error(' Error fetching Documents')
      }
      const Documents = Object.assign(new DocumentsEntity, response)
      return Documents;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error fetching Documents');
    }
  }


}