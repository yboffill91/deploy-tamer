// src/lib/api/customer.ts
import { CustomerMeResponse, Customer } from "@/lib/api/types";
import { authorizedFetch } from "./use-authorized-fetch";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const customerApi = {
  // ✅ Devuelve la respuesta completa (CustomerMeResponse)
  getCustomer: async (): Promise<CustomerMeResponse> => {
    return authorizedFetch<CustomerMeResponse>(`${API_BASE}/customer/me`);
  },

  // ✅ Para update, podemos seguir devolviendo solo el customer si el backend así lo hace
  updateCustomer: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await authorizedFetch<CustomerMeResponse>(`${API_BASE}/customer/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.customer;
  },
};
