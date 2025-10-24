// src/hooks/key_research/useCities.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCities, createCity, updateCity, deleteCity } from "@/lib/api/cities";
import { City, CityInput, CityUpdate } from "@/types/cities";

export function useCities() {
  const queryClient = useQueryClient();

  const citiesQuery = useQuery<City[]>({
    queryKey: ["cities"],
    queryFn: fetchCities,
  });

  // ✅ Obtener los datos como array seguro
  const citiesData = citiesQuery.data || [];

  const addCity = useMutation<City, Error, CityInput>({
    mutationFn: createCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });

  const editCity = useMutation<City, Error, CityUpdate>({
    mutationFn: ({ id, ...data }) => updateCity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });

  const removeCity = useMutation<{ success: boolean }, Error, string>({
    mutationFn: deleteCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });

  return {
    citiesQuery,
    citiesData, // ✅ Retornar datos como array seguro
    addCity,
    editCity,
    removeCity,
  };
}
