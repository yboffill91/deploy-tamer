import { CustomCard } from '@/components/CustomCard';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Switch,
} from '@/components/ui';
import { Globe, MapPin, Search } from 'lucide-react';
import { WordsContainer } from './WordsContainer';

export const KeywordResearchCityComponent = () => {
  return (
    <CustomCard title='Cities Filter' icon={MapPin} disabled>
      <div className='flex flex-col gap-6 w-full'>
        <div className='w-full flex gap-2 items-center'>
          <InputGroup>
            <InputGroupInput placeholder='Enter a city name...' />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <div className='flex items-center justify-center gap-2 w-full max-w-32 '>
            <Switch />{' '}
            <span className='flex items-center gap-2 text-xs'>
              <Globe className='size-2.5 md:block hidden' />
              <span className='text-[0.6rem]'>Use All Cities</span>
            </span>
          </div>
        </div>
        <WordsContainer
          message='No Cities Added'
          list={[]}
          onDelete={() => console.log('Delete')}
        />
      </div>
    </CustomCard>
  );
};
