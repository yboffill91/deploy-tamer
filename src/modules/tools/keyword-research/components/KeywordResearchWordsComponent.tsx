'use client';

import { CustomWordsComponent } from './CustomWordsComponent';
import { useState } from 'react';

interface Props {
  emptyMessage: string;
  list: string[];
  removeHandler(word): void;
  addHandler(word): void;
}
export const KeywordResearchWordsComponent = ({
  emptyMessage,
  list,
  removeHandler,
  addHandler,
}: Props) => {
  const [keyword, setKeyword] = useState('');

  return (
    <CustomWordsComponent
      emptyMessageWorldsContainer={emptyMessage}
      inputHandleOnClick={() => {
        addHandler(keyword);
        setKeyword('');
      }}
      inputOnChangeValue={(e) => setKeyword(e.target.value)}
      inputValue={keyword}
      onDeleteWorldsContainer={(word) => removeHandler(word)}
      list={list}
    />
  );
};
