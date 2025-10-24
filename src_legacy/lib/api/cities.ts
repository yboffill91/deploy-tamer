// src/lib/api/cities.ts
import { City, CityInput, CityUpdate } from "@/types/cities";
import { authorizedFetch } from "./use-authorized-fetch";

const API_BASE = process.env.NEXT_PUBLIC_KR_BASE_URL_API || "http://localhost:4000";

// -----------------
// Fetch all cities
// -----------------
export async function fetchCities(): Promise<City[]> {
  try {
    const response = await authorizedFetch<any>(`/data_city`, {}, API_BASE);

    if (response?.data && Array.isArray(response.data)) {
      return response.data.map((c: any) => ({
        id: c.data_city_id,
        name: c.data_city_name,
        country: c.data_city_county || "",
        state: c.data_city_state_name || "",
        deletedAt: c.deleted_at,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}

// -----------------
// Create a city
// -----------------
export async function createCity(data: CityInput): Promise<City> {
  const response = await authorizedFetch<any>(
    `/data_city`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data_city_name: data.name, // obligatorio
        data_city_county: data.country,
      }),
    },
    API_BASE,
  );

  // 🔹 Mapear la respuesta a City
  return {
    id: response.data.data_city_id,
    name: response.data.data_city_name,
    country: response.data.data_city_county || "",
    createdAt: response.data.created_at,
    updatedAt: response.data.updated_at,
  };
}

// -----------------
// Update a city
// -----------------
export async function updateCity(id: string, data: Omit<CityUpdate, "id">): Promise<City> {
  return authorizedFetch<City>(
    `/data_city`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data_city_id: id, // obligatorio para el backend
        data_city_name: data.name, // obligatorio
        data_city_county: data.country || "", // opcional
      }),
    },
    API_BASE,
  );
}

// -----------------
// Delete a city
// -----------------
export async function deleteCity(id: string): Promise<{ success: boolean }> {
  await authorizedFetch<any>(`/data_city/${id}`, { method: "DELETE" }, API_BASE);
  return { success: true };
}
