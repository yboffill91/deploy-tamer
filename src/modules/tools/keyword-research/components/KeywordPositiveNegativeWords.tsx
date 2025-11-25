import { CustomCard } from '@/components/CustomCard';
import { Ban, Bot, CheckCircle } from 'lucide-react';
import { KeyWordResearchComponents } from './KeywordResearchPositiveWords';
import { Button } from '@/components/ui';

interface Props {
  onSetPositive(words: string[]): void;
  onSetNegative(words: string[]): void;
}

export const KeywordPositiveNegativeWords = ({
  onSetPositive,
  onSetNegative,
}: Props) => {
  return (
    <div className='grid md:grid-cols-2 gap-4 w-full'>
      <CustomCard title='Positive Keywords' icon={CheckCircle}>
        <KeyWordResearchComponents
          onSetWords={(words) => onSetPositive(words)}
          emptyMessage='No Positive Words Added'
        />
        <div className='w-full mt-3'>
          <Button disabled className='w-full' variant={'outline'} type='button'>
            <Bot />
            Generate Positive Words With AI
          </Button>
        </div>
      </CustomCard>
      <CustomCard title='Negative Keywords' icon={Ban}>
        <KeyWordResearchComponents
          onSetWords={(words) => onSetNegative(words)}
          emptyMessage='No Negative Words Added'
        />
        <div className='w-full mt-3'>
          <Button disabled className='w-full' variant={'outline'} type='button'>
            <Bot />
            Generate Negative Words With AI
          </Button>
        </div>
      </CustomCard>
    </div>
  );
};
