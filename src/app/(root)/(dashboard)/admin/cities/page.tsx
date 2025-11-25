'use client';

import { CustomPageLoader } from '@/components/CustomPageLoader';
import { showToast } from '@/components/CustomToaster';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
} from '@/components/ui';
import { CountriesEntity, StatesEntity, CitiesEntity } from '@/core/entities';
import { CitiesRepository } from '@/infrastructure/repositories';

import { CountriesDataTable } from '@/modules/users/admin/components/dataTables/CountriesDataTable';
import { StatesDataTable } from '@/modules/users/admin/components/dataTables/StatesDataTable';
import { CitiesDataTable } from '@/modules/users/admin/components/dataTables/CitiesDataTable';

import { useEffect, useState } from 'react';

const CitiesPage = () => {
  const [countries, setCountries] = useState<CountriesEntity[] | null>(null);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);

  const [isError, setIsError] = useState<string | null>(null);

  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [stateCode, setStateCode] = useState<string | null>(null);

  const [states, setStates] = useState<StatesEntity[] | null>(null);
  const [isLoadingStates, setIsLoadingStates] = useState(false);

  const [cities, setCities] = useState<CitiesEntity[] | null>(null);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const cities_repo = new CitiesRepository();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoadingCountries(true);
        const countriesData = await cities_repo.findCuntries();
        setCountries(countriesData);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : 'Error getting Data'
        );
      } finally {
        setIsLoadingCountries(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (!countryCode) return;

    const getData = async () => {
      try {
        setIsLoadingStates(true);
        const statesData = await cities_repo.findStates(countryCode);
        setStates(statesData);
        setCities(null); // Reset cities when country changes
        setStateCode(null);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : 'Error getting States'
        );
      } finally {
        setIsLoadingStates(false);
      }
    };
    getData();
  }, [countryCode]);

  useEffect(() => {
    if (!countryCode || !stateCode) return;

    const getData = async () => {
      try {
        setIsLoadingCities(true);
        const citiesData = await cities_repo.findCities(countryCode, stateCode);
        setCities(citiesData);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : 'Error getting Cities'
        );
      } finally {
        setIsLoadingCities(false);
      }
    };

    getData();
  }, [stateCode]);

  useEffect(() => {
    if (isError) {
      showToast({
        message: 'Error',
        description: isError,
        type: 'error',
      });
    }
  }, [isError]);

  return (
    <>
      {/* COUNTRIES */}
      {isLoadingCountries && (
        <CustomPageLoader message='Loading Countries Data' />
      )}

      <div className='flex items-start gap-6 justify-start w-full'>
        {countries && (
          <Card>
            <CardContent>
              <CountriesDataTable
                data={countries}
                onIso2Select={(iso2) => setCountryCode(iso2)}
              />
            </CardContent>
          </Card>
        )}

        {/* STATES */}
        {isLoadingStates && <CustomPageLoader message='Loading States Data' />}

        {states && !isLoadingStates && states.length > 0 && (
          <Card>
            <CardContent>
              <StatesDataTable
                data={states}
                onStateSelect={(el) => setStateCode(el)}
              />
            </CardContent>
          </Card>
        )}
        {states && states.length === 0 && (
          <NotFounded
            title={'No State Founded'}
            description={
              'It appears that there are no states, provinces, departments, or dependencies in the selected country. '
            }
          />
        )}

        {isLoadingCities && <CustomPageLoader message='Loading Cities Data' />}

        {cities &&
          !isLoadingCities &&
          !isLoadingStates &&
          cities.length > 0 && (
            <Card>
              <CardContent>
                <CitiesDataTable data={cities} />
              </CardContent>
            </Card>
          )}
        {cities && cities.length === 0 && (
          <NotFounded
            title={'No City Founded'}
            description={
              'It appears that there are no cities in the selected province, state, department, or dependency.'
            }
          />
        )}
      </div>
    </>
  );
};

export default CitiesPage;

const NotFounded = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Alert variant={'destructive'} className={'max-w-sm'}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
