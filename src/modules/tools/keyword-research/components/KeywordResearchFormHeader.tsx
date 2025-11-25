import { Button } from '@/components/ui';
import { Video } from 'lucide-react';

export const KeywordResearchFormHeader = () => {
  return (
    <header className='relative'>
      <h1 className='text-[clamp(1.5rem,5vw,2rem)] font-semibold'>
        Keyword Research Tool
      </h1>
      <p className='text-foreground/70 text-pretty'>
        Enterprise-grade keyword research powered by advanced AI. Leverage the
        same strategic approach used by industry leaders to discover
        high-impact, filter out irrelevant terms and analyze search patterns to
        identify the most profitable keywords for your business.
      </p>
      <div className='flex items-center gap-2 md:absolute md:top-0 md:right-0 mt-4 md:mt-0'>
        <Button
          variant='outline'
          size='sm'
          className='text-xs font-medium relative'
        >
          <Video /> See how it works
          <span className='rounded-full size-3  absolute -top-1 -right-1 bg-green-500/50 animate-ping' />
          <span className='rounded-full size-2    absolute -top-0.5 -right-0.5 bg-green-500 ' />
        </Button>
      </div>
    </header>
  );
};
