'use client';
import {
  Button,
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui';
import { Plus } from 'lucide-react';
import { WordsContainer } from './WordsContainer';

interface Props {
  inputOnChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  inputHandleOnClick: () => void;
  emptyMessageWorldsContainer: string;
  onDeleteWorldsContainer: (value: string) => void;
  list: string[];
}

export const CustomWordsComponent = ({
  emptyMessageWorldsContainer,
  inputHandleOnClick,
  inputOnChangeValue,
  inputValue,
  onDeleteWorldsContainer,
  list,
}: Props) => {
  return (
    <div className='grid grid-cols-1 gap-2'>
      <InputGroup>
        <InputGroupInput
          placeholder='Enter a keyword'
          onChange={inputOnChangeValue}
          value={inputValue}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Evita submit
              inputHandleOnClick(); // Ejecuta misma lógica del botón
            }
          }}
        />

        <InputGroupButton className='p-0' asChild>
          <Button
            size='icon'
            className='text-xs font-medium'
            variant='ghost'
            onClick={inputHandleOnClick}
            type='button'
          >
            <Plus />
          </Button>
        </InputGroupButton>
      </InputGroup>

      <WordsContainer
        message={emptyMessageWorldsContainer}
        list={list}
        onDelete={onDeleteWorldsContainer}
      />
    </div>
  );
};
