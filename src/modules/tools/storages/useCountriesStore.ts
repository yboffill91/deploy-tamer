import { CountriesEntity } from "@/core/entities";
import { CitiesRepository } from "@/infrastructure/repositories";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface useCountriesStoreType {
  countries: CountriesEntity[];
  setCountries: (countries: CountriesEntity[]) => void;
}

const useCountriesStore: useCountriesStoreType = create(
  persist(
    (set) => ({
      countries: [],
      setCountries: (countries: CountriesEntity[]) => set({ countries }),
    }),
    {
      name: "countries-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
