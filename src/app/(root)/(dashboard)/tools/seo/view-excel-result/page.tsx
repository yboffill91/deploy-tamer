'use client';
import { Button } from '@/components/ui';
import { useKeywordStore } from '@/modules/tools/keyword-research/all-request/context/KeywordSelectionStore';
import { ReviewResultsDataDataTable } from '@/modules/tools/keyword-research/all-request/ReviewResultsDataDataTable';
import { CommonHeader } from '@/modules/users/admin';
import { ArrowLeft, List } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ShowResultStats = () => {
  const result = useKeywordStore((st) => st.selection);
  const clear = useKeywordStore((st) => st.clearSelection);

  const router = useRouter();

  return (
    <div className='relative w-full'>
      <CommonHeader
        icon={List}
        desc='Review the result statistics..'
        title='Keywords Result Stats'
      />
      <Button
        className='absolute top-0 right-0'
        size='sm'
        variant='secondary'
        onClick={() => {
          clear();
          router.back();
        }}
      >
        <ArrowLeft /> Back to Keywords Research
      </Button>

      <ReviewResultsDataDataTable data={result} />
    </div>
  );
};

export default ShowResultStats;
