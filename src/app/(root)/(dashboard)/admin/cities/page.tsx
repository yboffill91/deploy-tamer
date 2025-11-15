"use client";

import { CustomPageLoader } from "@/components/CustomPageLoader";
import { showToast } from "@/components/CustomToaster";
import { Card, CardContent } from "@/components/ui";
import { CountriesEntity, StatesEntity, CitiesEntity } from "@/core/entities";
import { CitiesRepository } from "@/infraestructure/repositories";

import { CountriesDataTable } from "@/modules/users/admin/components/dataTables/CountriesDataTable";
import { StatesDataTable } from "@/modules/users/admin/components/dataTables/StatesDataTable";
import { CitiesDataTable } from "@/modules/users/admin/components/dataTables/CitiesDataTable";

import { useEffect, useState } from "react";

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

  // 1. Fetch countries --------------------------
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoadingCountries(true);
        const countriesData = await cities_repo.findCuntries();
        setCountries(countriesData);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : "Error getting Data"
        );
      } finally {
        setIsLoadingCountries(false);
      }
    };
    getData();
  }, []);

  // 2. Fetch states cuando cambia el código del país -------------
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
          error instanceof Error ? error.message : "Error getting States"
        );
      } finally {
        setIsLoadingStates(false);
      }
    };
    getData();
  }, [countryCode]);

  // 3. Fetch cities cuando cambia stateId ------------------------
  useEffect(() => {
    if (!countryCode || !stateCode) return;

    const getData = async () => {
      try {
        setIsLoadingCities(true);
        const citiesData = await cities_repo.findCities(countryCode, stateCode);
        setCities(citiesData);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : "Error getting Cities"
        );
      } finally {
        setIsLoadingCities(false);
      }
    };

    getData();
  }, [stateCode]);

  // Global error toast
  useEffect(() => {
    if (isError) {
      showToast({
        message: "Error",
        description: isError,
        type: "error",
      });
    }
  }, [isError]);

  return (
    <>
      {/* COUNTRIES */}
      {isLoadingCountries && (
        <CustomPageLoader message="Loading Countries Data" />
      )}

      <div className="flex items-start gap-6 justify-start w-full">
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
        {isLoadingStates && <CustomPageLoader message="Loading States Data" />}

        {states && !isLoadingStates && states !== null && (
          <Card>
            <CardContent>
              <StatesDataTable
                data={states}
                onStateSelect={(el) => setStateCode(el)}
              />
            </CardContent>
          </Card>
        )}

        {isLoadingCities && <CustomPageLoader message="Loading Cities Data" />}

        {cities && !isLoadingCities && !isLoadingStates && cities !== null && (
          <Card>
            <CardContent>
              <CitiesDataTable data={cities} />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default CitiesPage;
