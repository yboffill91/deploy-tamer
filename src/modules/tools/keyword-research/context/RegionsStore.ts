import { CitiesEntity, CountriesEntity, StatesEntity } from '@/core/entities';
import { CitiesRepository } from '@/infrastructure/repositories';
import { create } from 'zustand';

type Steps = 'Country' | 'State';

interface RegionStore {
  countries: CountriesEntity[] | null;
  getCountries(): Promise<void>;

  loadingCountries: boolean;

  countryCode: string[];
  setCountryCode(country: CountriesEntity): void;

  selectedCountriesMap: Map<string, string[]>;
  setSelectedCountriesMap(country: CountriesEntity): void;

  selectedCountries: string[];
  setSelectedCountry(country: CountriesEntity): void;

  step: Steps;
  incrementStep(): void;
  decrementStep(): void;

  error: string;

  states: Record<string, StatesEntity[]> | null;
  loadingStates: boolean;
  getStates(): Promise<void>;
  selectedStates: string[];
  setSelectedStates(state: StatesEntity): void;

  showAllCitiesForState: boolean;
  cities: CitiesEntity[] | null;
  getCities(State: StatesEntity, Country: CountriesEntity): Promise<void>;

  //  Helpers
  getErrorMessage(error: unknown): string;
}

export const useRegionStore = create<RegionStore>((set, get) => ({
  // Estados Iniciales
  countries: null,
  countryCode: [],
  selectedCountries: [],
  step: 'Country',
  loadingCountries: false,
  error: '',
  selectedCountriesMap: new Map(),
  states: null,
  loadingStates: false,
  selectedStates: [],
  showAllCitiesForState: false,
  cities: [],

  // Helpers
  getErrorMessage: (error: unknown) => {
    return error instanceof Error
      ? error.message
      : `Unexpected error: ${String(error)}`;
  },

  // Fetchers
  getCountries: async () => {
    const { getErrorMessage } = get();
    try {
      set({ loadingCountries: true });
      const REPO = new CitiesRepository();
      const Countries = await REPO.findCuntries();
      set({ countries: Countries });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
    } finally {
      set({ loadingCountries: false });
    }
  },

  // Setters

  setCountryCode: (country) =>
    set((state) => {
      const code = country.iso2!;
      const exists = state.countryCode.includes(code);

      return {
        countryCode: exists
          ? state.countryCode.filter((c) => c !== code)
          : [...state.countryCode, code],
      };
    }),

  setSelectedCountry: (country) =>
    set((state) => {
      const name = country.name!;
      const exists = state.selectedCountries.includes(name);

      return {
        selectedCountries: exists
          ? state.selectedCountries.filter((c) => c !== name)
          : [...state.selectedCountries, name],
      };
    }),

  incrementStep: () => {
    const { step } = get();
    if (step === 'Country') set({ step: 'State' });
    if (step === 'State') set({ step: 'Country' });
  },

  decrementStep: () => {
    const { step } = get();
    if (step === 'Country') return;
    if (step === 'State') set({ step: 'Country' });
  },

  setSelectedCountriesMap: (region: CountriesEntity | StatesEntity) =>
    set((state) => {
      const code =
        region instanceof CountriesEntity ? region.iso2! : region.country_code!;
      const name = region.name!;

      if (state.selectedCountriesMap.has(code)) {
        if (state.selectedCountriesMap.get(code)?.includes(name)) {
          const array = state.selectedCountriesMap
            .get(code)
            ?.filter((item) => item != name);
          if (array === undefined) {
            state.selectedCountriesMap.delete(code);
          } else {
            state.selectedCountriesMap.set(code, array!);
          }
        } else {
          state.selectedCountriesMap.get(code)?.push(name);
        }
      } else {
        state.selectedCountriesMap.set(code, [name]);
      }
      return state;
    }),

  // --> States
  getStates: async () => {
    set({ loadingStates: true });
    const REPO = new CitiesRepository();
    const { countryCode, getErrorMessage } = get();
    try {
      const promises = countryCode.map((country) => REPO.findStates(country));
      const States = await Promise.all(promises);
      const statesMap: Record<string, StatesEntity[]> = {};
      countryCode.forEach((code, index) => {
        statesMap[code] = States[index];
      });

      set({ states: statesMap });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
    } finally {
      set({ loadingStates: false });
    }
  },

  setSelectedStates: (State) =>
    set((state) => {
      const name = State.name!;
      const exists = state.selectedStates.includes(name);

      return {
        selectedStates: exists
          ? state.selectedStates.filter((c) => c !== name)
          : [...state.selectedStates, name],
      };
    }),

  getCities: async (StatesEntity, Country) => {
    const REPO = new CitiesRepository();
    try {
    } catch (error) {
    } finally {
    }
  },
}));
