'use client';
import { CountriesEntity } from '@/core/entities';
import { CountriesDataTable } from '@/modules/users/admin';

interface Props {
  regions: CountriesEntity[];
  onSelected(data: CountriesEntity): void;
}
export const CustomRegionSelector = ({ regions, onSelected }: Props) => {
  return (
    <>
      <div className='h-12 bg-card w-full'></div>
      <CountriesDataTable
        data={regions}
        onNameSelect={(el) => onSelected(el)}
        showView={false}
        showNextStep
        onIso2Select={(iso) => console.log(iso)}
      />
    </>
  );
};
