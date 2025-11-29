import { CustomCard } from '@/components/CustomCard';
import { CirclePlus } from 'lucide-react';
import { KeywordResearchWordsComponent } from './KeywordResearchWordsComponent';
import { useExtraPositiveStore } from '../context/WordsStoreFactory';
import { GenerateWordsWithAiButton } from './GenerateWordsWithAiButton';

export const KeywordExtraPositive = () => {
  const extraWords = useExtraPositiveStore((st) => st.words);
  const addExtraWord = useExtraPositiveStore((st) => st.addWord);
  const removeExtraWord = useExtraPositiveStore((st) => st.deleteWord);
  const loading = useExtraPositiveStore((st) => st.isLoading);

  return (
    <CustomCard title='Extra Positive Keywords' icon={CirclePlus}>
      <KeywordResearchWordsComponent
        emptyMessage='No Extra Positive Words Added'
        addHandler={(word) => addExtraWord(word)}
        list={extraWords}
        removeHandler={(word) => removeExtraWord(word)}
      />
      <div className='w-full mt-3'>
        <GenerateWordsWithAiButton
          type='Extra Positive Words'
          isLoading={loading}
        />
      </div>
    </CustomCard>
  );
};
