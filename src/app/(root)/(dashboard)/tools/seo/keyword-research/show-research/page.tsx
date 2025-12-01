'use client';

import { Card, CardContent } from '@/components/ui';
import { useResearchStore } from '@/modules/tools/keyword-research/all-request/context/ResearchStore';
import { KeywordResearchView } from '@/modules/tools/keyword-research/show-request/KeywordResearchView';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ShowResearchPage = () => {
  const selectedResearch = useResearchStore((st) => st.selectedResearch);
  const router = useRouter();
  useEffect(() => {
    if (!selectedResearch || selectedResearch === null) {
      router.back();
    }
  }, [selectedResearch]);

  return (
    <Card>
      <CardContent>
        <KeywordResearchView research={selectedResearch} />
      </CardContent>
    </Card>
  );
};

export default ShowResearchPage;
