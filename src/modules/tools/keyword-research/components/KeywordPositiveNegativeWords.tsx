import { CustomCard } from '@/components/CustomCard';
import { Ban, CheckCircle } from 'lucide-react';
import { KeywordResearchWordsComponent } from './KeywordResearchWordsComponent';
import {
  useNegativeStore,
  usePositiveStore,
} from '../context/WordsStoreFactory';
import { GenerateWordsWithAiButton } from './GenerateWordsWithAiButton';

export const KeywordPositiveNegativeWords = () => {
  const positiveWords = usePositiveStore((st) => st.words);
  const addPositiveWord = usePositiveStore((st) => st.addWord);
  const removePositiveWord = usePositiveStore((st) => st.deleteWord);
  const loadingPositiveWords = usePositiveStore((st) => st.isLoading);

  const negativeWords = useNegativeStore((st) => st.words);
  const addNegativeWord = useNegativeStore((st) => st.addWord);
  const removeNegativeWord = useNegativeStore((st) => st.deleteWord);
  const loadingNegativeWords = useNegativeStore((st) => st.isLoading);

  return (
    <div className='grid lg:grid-cols-2 gap-4 w-full'>
      <CustomCard title='Positive Keywords' icon={CheckCircle}>
        <KeywordResearchWordsComponent
          emptyMessage='No Positive Words Added'
          addHandler={(word) => addPositiveWord(word)}
          list={positiveWords}
          removeHandler={(word) => removePositiveWord(word)}
        />
        <div className='w-full mt-3'>
          <GenerateWordsWithAiButton
            type='Positive Words'
            isLoading={loadingPositiveWords}
          />
        </div>
      </CustomCard>
      <CustomCard title='Negative Keywords' icon={Ban}>
        <KeywordResearchWordsComponent
          emptyMessage='No Negative Words Added'
          addHandler={(word) => addNegativeWord(word)}
          list={negativeWords}
          removeHandler={(word) => removeNegativeWord(word)}
        />
        <div className='w-full mt-3'>
          <GenerateWordsWithAiButton
            type='Negative Words'
            isLoading={loadingNegativeWords}
          />
        </div>
      </CustomCard>
    </div>
  );
};
