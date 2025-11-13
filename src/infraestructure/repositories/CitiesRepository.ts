import { CitiesEntity, CountriesEntity, StatesEntity } from '@/core/entities';
import { fetchHelper } from '@/lib/fetch-helper';
import { countriesApi } from '@/lib/apis';
import {
  ResponseCitiesDTO,
  ResponseCountriesDTO,
  ResponseStatesDTO,
} from '@/core/dto';
interface ICitiesRepository {
  findCuntries(): Promise<CountriesEntity[]>;
  findStates(countryId: string): Promise<StatesEntity[]>;
  findCities(countrId: string, stateId: string): Promise<CitiesEntity[]>;
}

export class CitiesRepository implements ICitiesRepository {
  async findCuntries(): Promise<CountriesEntity[]> {
    try {
      const response = await fetchHelper<ResponseCountriesDTO[]>(
        `${countriesApi}/countries`
      );
      if (!response) {
        throw new Error('Empty country response');
      }
      const contries = response.map((country) =>
        Object.assign(new CountriesEntity(), country)
      );
      return contries;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error fetching Countries'
      );
    }
  }

  async findStates(countryId: string): Promise<StatesEntity[]> {
    try {
      const response = await fetchHelper<ResponseStatesDTO[]>(
        `${countriesApi}/${countryId}`
      );
      if (!response) {
        throw new Error('Empty states response');
      }
      const states = response.map((country) =>
        Object.assign(new StatesEntity(), country)
      );
      return states;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error fetching Countries'
      );
    }
  }
  async findCities(countrId: string, stateId: string): Promise<CitiesEntity[]> {
    try {
      const response = await fetchHelper<ResponseCitiesDTO[]>(
        `${countriesApi}/${countrId}/${stateId}`
      );
      if (!response) {
        throw new Error('Empty country response');
      }
      const cities = response.map((country) =>
        Object.assign(new CitiesEntity(), country)
      );
      return cities;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error fetching Countries'
      );
    }
  }
}
