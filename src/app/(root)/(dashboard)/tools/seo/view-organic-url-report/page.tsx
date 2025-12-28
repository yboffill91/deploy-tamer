'use client';
import { Button } from '@/components/ui';
import { ReviewOrganicUrlData } from '@/modules/tools/keyword-research/all-request/ReviewOrganicUrlData';
import { CommonHeader } from '@/modules/users/admin';
import { ArrowLeft, Link2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ViewOrganicUrlResult = () => {
  const router = useRouter();
  return (
    <div className='relative'>
      <CommonHeader
        icon={Link2}
        desc='View the Organic URL Result'
        title='Organic URL Report'
      />

      <Button
        className='absolute top-0 right-0'
        size='sm'
        variant='secondary'
        onClick={() => {
          router.back();
        }}
      >
        <ArrowLeft /> Back to Keywords Research
      </Button>

      <ReviewOrganicUrlData />
    </div>
  );
};

export default ViewOrganicUrlResult;
