'use client';
import { Button } from '@/components/ui';
import { useKeywordStore } from '@/modules/tools/keyword-research/all-request/context/KeywordSelectionStore';
import { ResultResearchDataTable } from '@/modules/tools/keyword-research/all-request/ResultResearchDataTable';
import { CommonHeader } from '@/modules/users/admin';
import { ArrowLeft, ListCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ShowResult = () => {
  const result = useKeywordStore((st) => st.selection);
  const clesr = useKeywordStore((st) => st.clearSelection);

  const router = useRouter();

  return (
    <div className='relative w-full'>
      <CommonHeader
        icon={ListCheck}
        desc='Select the keywords from the results to generate the report or generate a new keyword research.'
        title='Keywords Result List'
      />
      <Button
        className='absolute top-0 right-0'
        size='sm'
        variant='secondary'
        onClick={() => router.back()}
      >
        <ArrowLeft /> Back to Keywords Research
      </Button>

      <ResultResearchDataTable data={result} />
    </div>
  );
};

export default ShowResult;
