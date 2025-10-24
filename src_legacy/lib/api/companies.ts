// src/lib/api/companies.ts
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from "@/types/companies";
import { authorizedFetch } from "./use-authorized-fetch";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_KR_BASE_URL_API}/data_company`;

// Interface para la respuesta de la API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  dataCount: number;
}

export const companyApi = {
  getAll: async (): Promise<Company[]> => {
    try {
      const result = await authorizedFetch<any>(API_BASE_URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Origin: globalThis.location.origin,
        },
        credentials: "include",
      });

      console.log("📍 API RESULT:", result);
      console.log("📍 COMPANIES DATA:", result?.data);

      // ✅ VERIFICACIÓN: Asegurar que result.data existe y es un array
      if (result && result.data && Array.isArray(result.data)) {
        console.log("📍 MAPPING COMPANIES...");

        const mappedCompanies = result.data.map((c: any) => {
          // ✅ Mapeo CORRECTO basado en tu debug
          return {
            id: c.data_company_id, // ✅ data_company_id → id
            name: c.data_company_name, // ✅ data_company_name → name
            ownerId: c.company_owner?.employee_id || null,
            createdAt: c.created_at,
            updatedAt: c.updated_at,
            deletedAt: c.deleted_at,
          };
        });

        console.log("📍 MAPPED COMPANIES:", mappedCompanies);
        return mappedCompanies;
      }

      console.warn("📍 No data found in response");
      return [];
    } catch (error) {
      console.error("📍 Error in companyApi.getAll:", error);
      return [];
    }
  },

  create: async (request: CreateCompanyRequest): Promise<Company> => {
    const result = await authorizedFetch<ApiResponse<any>>(API_BASE_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: globalThis.location.origin,
      },
      credentials: "include",
      body: JSON.stringify({
        data_company_name: request.name,
      }),
    });

    // 🔹 Acceder a result.data.data para el objeto individual
    if (result?.success && result.data) {
      const c = result.data;
      return {
        id: c.data_company_id,
        name: c.data_company_name,
        ownerId: c.company_owner?.employee_id || null,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        deletedAt: c.deleted_at,
      };
    }

    throw new Error("Invalid response from backend");
  },

  update: async (request: UpdateCompanyRequest): Promise<Company> => {
    const result = await authorizedFetch<ApiResponse<any>>(API_BASE_URL, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: globalThis.location.origin,
      },
      credentials: "include",
      body: JSON.stringify({
        data_company_id: request.id,
        data_company_name: request.name,
      }),
    });

    // 🔹 Acceder a result.data.data
    if (result?.success && result.data) {
      const c = result.data;
      return {
        id: c.data_company_id,
        name: c.data_company_name,
        ownerId: c.company_owner?.employee_id || null,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        deletedAt: c.deleted_at,
      };
    }

    throw new Error("Invalid response from backend");
  },

  delete: async (companyId: number): Promise<void> => {
    const result = await authorizedFetch<ApiResponse<void>>(`${API_BASE_URL}/${companyId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: globalThis.location.origin,
      },
      credentials: "include",
    });

    if (!result?.success) {
      throw new Error("Failed to delete company");
    }
  },
};
