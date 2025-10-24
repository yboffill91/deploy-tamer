// src/types/cities.d.ts

// Representa una ciudad que viene de la API (incluye id)
export interface City {
  id: string;
  name: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

// Representa lo que enviamos al crear una ciudad
export interface CityInput {
  name: string;
  country: string;
}

// Representa lo que enviamos al actualizar (id + campos opcionales)
export interface CityUpdate {
  id: string;
  name?: string;
  country?: string;
}
