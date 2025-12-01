'use client';

import { Button } from '@/components/ui/button';
import { CompetitionLevel } from '@/core/entities';

interface CompetitionFilterProps {
  competitions: CompetitionLevel[];
  selected: string | null;
  onSelect: (competition: string | null) => void;
}

export function CompetitionFilter({
  competitions,
  selected,
  onSelect,
}: CompetitionFilterProps) {
  return (
    <div className='flex flex-wrap gap-2 mb-6'>
      <Button
        onClick={() => onSelect(null)}
        variant={selected === null ? 'default' : 'outline'}
        size='sm'
        className='rounded-full'
      >
        All Keywords
      </Button>
      {competitions.map((comp) => (
        <Button
          key={comp}
          onClick={() => onSelect(comp)}
          variant={selected === comp ? 'default' : 'outline'}
          size='sm'
          className='rounded-full'
        >
          {comp}
        </Button>
      ))}
    </div>
  );
}
