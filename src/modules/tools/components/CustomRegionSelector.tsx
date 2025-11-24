"use client";
import { Button, SheetClose } from "@/components/ui";
import { CountriesEntity } from "@/core/entities";
import { CountriesDataTable } from "@/modules/users/admin";
import { CheckCheck } from "lucide-react";
import { useState } from "react";

interface dataToPass {
  selectedCountries: string[];
  selectedCodes: string[];
}
interface Props {
  region: CountriesEntity[];
  onFinish(data: dataToPass): void;
}
export const RegionSelector = ({ region, onFinish }: Props) => {
  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
  const [selectedCountriesNames, setSelectedCountriesNames] = useState<
    string[]
  >([]);

  const handleFinish = () => {
    onFinish({
      selectedCountries: selectedCountriesNames,
      selectedCodes: selectedRegion,
    });
  };
  return (
    <>
      <div className="h-[80dvh] overflow-y-auto">
        <CountriesDataTable
          data={region}
          onIso2Select={(value) => {
            if (selectedRegion.includes(value)) {
              setSelectedRegion((prev) => prev.filter((el) => el !== value));
              return;
            }
            setSelectedRegion((prev) => [...prev, value]);
          }}
          onNameSelect={(value) => {
            if (selectedCountriesNames.includes(value)) {
              setSelectedCountriesNames((prev) =>
                prev.filter((el) => el !== value)
              );
              return;
            }
            setSelectedCountriesNames((prev) => [...prev, value]);
          }}
          showView={false}
          showNextStep={false}
          showSelect
        />
      </div>
      <SheetClose asChild>
        <Button className="w-full" onClick={handleFinish}>
          <CheckCheck /> Finish Selection {selectedCountriesNames.length}
        </Button>
      </SheetClose>
    </>
  );
};
