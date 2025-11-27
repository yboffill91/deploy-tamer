import { CountriesEntity } from '@/core/entities';
import { CountriesDataTable } from '@/modules/users/admin';

interface Props {
  regions: CountriesEntity[];
  onSelected(data: CountriesEntity): void;
}
export const CustomRegionSelector = ({ regions, onSelected }: Props) => {
  return (
    <CountriesDataTable
      data={regions}
      onNameSelect={(el) => onSelected(el)}
      showView={false}
      showNextStep={false}
      showSelect
    />
  );
};
