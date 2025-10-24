// src/components/keywordResearch/CitiesCard.tsx
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCities } from "@/hooks/key_research/use-cities";
import { useKeywordResearchStore } from "@/stores/key_research/keyword-research-store";

export const CitiesCard = () => {
  const [searchInput, setSearchInput] = useState("");
  const { citiesQuery, citiesData } = useCities(); // ✅ Usar citiesData en lugar de citiesQuery.data
  const { cities, useAllCities, setCities, setUseAllCities } = useKeywordResearchStore();

  const handleSwitchChange = (checked: boolean) => {
    setUseAllCities(checked);
    if (checked) {
      setCities([]);
    }
  };

  // ✅ CORRECCIÓN: Asegurar que availableCities siempre sea un array
  const availableCities = Array.isArray(citiesData) ? citiesData : [];

  const filteredCities = availableCities.filter((city) => city.name.toLowerCase().includes(searchInput.toLowerCase()));

  const handleAddCity = (cityName: string) => {
    if (!cities.includes(cityName)) {
      setCities([...cities, cityName]);
      setSearchInput("");
    }
  };

  const handleRemoveCity = (cityName: string) => {
    setCities(cities.filter((c) => c !== cityName));
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Cities Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              list="cities"
              value={searchInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (filteredCities[0]) {
                    handleAddCity(filteredCities[0].name);
                  }
                }
              }}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter city name..."
              className="pl-9 font-mono text-sm"
              disabled={useAllCities || citiesQuery.isLoading}
            />
            <datalist id="cities">
              {filteredCities.map((city) => (
                <option key={city.id} value={city.name} />
              ))}
            </datalist>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Switch
                id="use-all-cities"
                checked={useAllCities}
                onCheckedChange={handleSwitchChange}
                disabled={citiesQuery.isLoading}
              />
              <Label htmlFor="use-all-cities" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Use All Cities
              </Label>
            </div>
            {!useAllCities && (
              <Button
                onClick={() => {
                  if (filteredCities[0]) {
                    handleAddCity(filteredCities[0].name);
                  }
                }}
                disabled={
                  citiesQuery.isLoading ||
                  !searchInput.trim() ||
                  filteredCities.length === 0 ||
                  cities.includes(filteredCities[0]?.name)
                }
              >
                Add
              </Button>
            )}
          </div>
        </div>

        {citiesQuery.error && (
          <p className="text-destructive mb-4 text-sm">Failed to load cities. Please try again later.</p>
        )}

        {!useAllCities && (
          <div className="flex h-64 flex-wrap content-start gap-2 overflow-y-auto rounded-md border p-2">
            {citiesQuery.isLoading ? (
              <p className="text-muted-foreground w-full py-4 text-center">Loading cities...</p>
            ) : cities.length === 0 ? (
              <p className="text-muted-foreground w-full py-4 text-center">No cities added yet</p>
            ) : (
              cities.map((city, index) => (
                <Badge
                  key={`${city}-${index}`}
                  variant="secondary"
                  className="hover:bg-secondary/80 group flex cursor-pointer items-center gap-2 text-sm"
                  onClick={() => handleRemoveCity(city)}
                >
                  {city}
                  <X className="h-3 w-3 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
                </Badge>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
