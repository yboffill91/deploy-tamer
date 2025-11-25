'use client';

import { showToast } from '@/components/CustomToaster';
import { CustomWordsComponent } from './CustomWordsComponent';
import { useEffect, useState } from 'react';

interface Props {
  onSetWords(words: string[]): void;
  emptyMessage: string;
}
export const KeyWordResearchComponents = ({
  onSetWords,
  emptyMessage,
}: Props) => {
  const [words, setWords] = useState<string[]>([]);
  const [word, setWord] = useState<string>('');
  const [duplicatedWordsError, setDuplicatedWordsError] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (duplicatedWordsError) {
      showToast({
        type: 'error',
        description: duplicatedWordsError,
        message: 'Error',
      });
    }
  }, [duplicatedWordsError]);

  useEffect(() => {
    onSetWords(words);
  }, [words]);

  const handleAddElement = (value: string) => {
    if (words.includes(value)) {
      setDuplicatedWordsError('Word allready in the list');
      return;
    }

    setWords([...words, value]);
    setWord('');
  };

  const handleDelete = (value: string) => {
    const newList = words.filter((w) => w !== value);
    setWords(newList);
  };

  return (
    <CustomWordsComponent
      emptyMessageWorldsContainer={emptyMessage}
      inputHandleOnClick={() => {
        handleAddElement(word);
      }}
      inputOnChangeValue={(e) => setWord(e.target.value)}
      inputValue={word}
      onDeleteWorldsContainer={(word) => handleDelete(word)}
      list={words}
    />
  );
};
