import { CitiesEntity, CountriesEntity, StatesEntity } from '@/core/entities';
import { CitiesRepository } from '@/infrastructure/repositories';
import { create } from 'zustand';

type Steps = 'Country' | 'State' | 'Cities';
interface RegionStore {
  // Steps
  step: Steps;
  setSteps(): void;

  // Countries
  allCountries: CountriesEntity[] | null;
  selectedCountryName: string;
  selectedCountryCode: string;
  getAllCountries(): Promise<void>;
  setSelectedCountryName(country: CountriesEntity): void;
  setSelectedCountryCode(country: CountriesEntity): void;
  isLoading: boolean;

  // States
  countryStates: StatesEntity[] | null;
  selectedState: string;
  selectedStateCode: string;
  getStates(): Promise<void>;
  setSelectedState(state: StatesEntity): void;
  setSelectedStateCode(state: StatesEntity): void;

  // Cities
  citiesByState: CitiesEntity[] | null;
  selectedCities: string[];
  getCities(): Promise<void>;
  setSelectedCities(city: CitiesEntity): void;

  error: string;

  partialRoute: string[];
  setPartialRoute(place: string): void;

  getErrorMessage(error: unknown): string;

  resetState(): void;

  finalValue: Map<number, string[]>;
  setFinalValue(): void;
}

export const useRegionStore = create<RegionStore>((set, get) => ({
  allCountries: null,
  selectedCountryCode: 'US',
  selectedCountryName: 'United States',
  step: 'Country',
  error: '',
  partialRoute: [],
  isLoading: false,
  countryStates: null,
  selectedState: '',
  selectedStateCode: '',
  citiesByState: null,
  selectedCities: [],

  finalValue: new Map(),

  getErrorMessage: (error: unknown) => {
    return error instanceof Error
      ? error.message
      : `Unexpected error: ${String(error)}`;
  },

  getAllCountries: async () => {
    const Repo = new CitiesRepository();

    try {
      set({ isLoading: true });
      const Countries = await Repo.findCuntries();
      set({ allCountries: Countries });
    } catch (error) {
      const { getErrorMessage } = get();
      const message = getErrorMessage(error);
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedCountryCode: (country) => {
    set({ selectedCountryCode: country.iso2 });
  },
  setSelectedCountryName: (country) => {
    set({ selectedCountryName: country.name });
  },

  setSteps: () => {
    const { step } = get();
    set({
      step:
        step === 'Country' ? 'State' : step === 'State' ? 'Cities' : 'Country',
    });
  },
  setPartialRoute: (place) =>
    set((state) => {
      state.partialRoute.push(place);
      return state;
    }),

  getStates: async () => {
    const { selectedCountryCode } = get();
    set({ isLoading: true });
    const Repo = new CitiesRepository();
    const States = await Repo.findStates(selectedCountryCode);
    set({ countryStates: States });
    try {
    } catch (error) {
      const { getErrorMessage } = get();
      const message = getErrorMessage(error);
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },
  setSelectedState: (el) => {
    set({ selectedState: el.name });
  },
  setSelectedStateCode: (el) => {
    set({ selectedStateCode: el.iso2 });
  },

  setSelectedCities: (city) => {
    const { selectedCities } = get();
    set({
      selectedCities: selectedCities.includes(city.name)
        ? selectedCities.filter((el) => el !== city.name)
        : [...selectedCities, city.name],
    });
  },

  getCities: async () => {
    const { selectedCountryCode, selectedStateCode, getErrorMessage } = get();
    const Repo = new CitiesRepository();
    try {
      set({ isLoading: true });
      const Cities = await Repo.findCities(
        selectedCountryCode,
        selectedStateCode
      );
      set({ citiesByState: Cities });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },
  resetState: () => {
    set({
      selectedCountryCode: 'US',
      selectedCountryName: 'United States',
      step: 'Country',
      partialRoute: [],
      countryStates: null,
      selectedState: '',
      selectedStateCode: '',
      citiesByState: null,
      selectedCities: [],
    });
  },
  setFinalValue: () =>
    set((state) => {
      const { partialRoute, selectedCities } = state;
      let index = 0;
      if (selectedCities.length === 0) {
        state.finalValue.set(index, [...partialRoute.toReversed()]);
        index++;
      } else {
        selectedCities.map((city) => {
          state.finalValue.set(index, [...partialRoute, city].toReversed());
          index++;
        });
      }
      return state;
    }),
}));
