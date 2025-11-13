'use client';

import { showToast } from '@/components/CustomToaster';
import { GenericDataTable } from '@/components/GenericDataTable';
import { Card, CardContent, Table, TableHeader } from '@/components/ui';
import { CountriesEntity } from '@/core/entities';
import { CitiesRepository } from '@/infraestructure/repositories';
import { CitiesDataTable } from '@/modules/users/admin/components/dataTables/CitiesDataTable';
import { useEffect, useState } from 'react';

const CitiesPage = () => {
  const [countries, setCountries] = useState<CountriesEntity[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const cities_repo = new CitiesRepository();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const countriesData = await cities_repo.findCuntries();
        setCountries(countriesData);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : 'Error getting Data'
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (isError) {
      showToast({
        message: 'Error',
        description: isError,
        type: 'error',
      });
    }
  }, []);

  return (
    <>
      {isLoading && <p>Loading ....</p>}
      <div className='flex items-center justify-start w-full '>
        <Card>
          <CardContent>
            {countries && (
              <div className=''>
                <CitiesDataTable
                  data={countries}
                  excludeColumns={[
                    'iso2',
                    'iso3',
                    'numeric_code',
                    'phonecode',
                    'currency',
                    'currency_name',
                    'currency_symbol',
                    'tld',
                    'native',
                    'nationality',
                    'latitude',
                    'longitude',
                    'emoji',
                    'emojiU',
                  ]}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CitiesPage;
