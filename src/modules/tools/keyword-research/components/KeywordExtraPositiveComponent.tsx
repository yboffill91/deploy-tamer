import { CustomCard } from '@/components/CustomCard';
import { CirclePlus } from 'lucide-react';
import { KeyWordResearchComponents } from './KeywordResearchPositiveWords';

interface Props {
  onSetExtraPositive(words: string[]): void;
}

export const KeywordExtraPositive = ({ onSetExtraPositive }: Props) => {
  return (
    <CustomCard title='Extra Positive Keywords' icon={CirclePlus}>
      <KeyWordResearchComponents
        onSetWords={(words) => onSetExtraPositive(words)}
        emptyMessage='No Extra Positive Words Added'
      />
    </CustomCard>
  );
};
