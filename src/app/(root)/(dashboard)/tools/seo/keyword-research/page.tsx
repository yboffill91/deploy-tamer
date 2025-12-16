'use client';
import { Tabs, TabsContent, TabsList } from '@/components/ui';
import { FileText, List } from 'lucide-react';
import { KeywordResearchForm } from '@/modules/tools/keyword-research/KeywordResearchForm';
import { KeywordsResearchDataTable } from '@/modules/tools/keyword-research/all-request/KeywordsResearchDataTable';
import { CustomTabTrigger } from '@/modules/tools/components';
import { useState } from 'react';

const KeywordResearchPage = () => {
  const [selectedTab, setSelectedTab] = useState('form');
  return (
    <>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className='w-full container mx-auto max-w-7xl flex shrink-0 items-center justify-start lg:justify-center   p-0 mb-2 rounded-none overflow-x-auto snap-none md:snap-x md:snap-mandatory snap-always bg-transparent'>
          <CustomTabTrigger
            icon={FileText}
            tab_name='Keyword Research Form'
            tab_value='form'
          />
          <CustomTabTrigger
            icon={List}
            tab_name='All Researchs'
            tab_value='researchs'
          />
        </TabsList>
        <TabsContent value='form'>
          <KeywordResearchForm
            onChangeTab={() => setSelectedTab('researchs')}
          />
        </TabsContent>
        <TabsContent value='researchs'>
          <KeywordsResearchDataTable
            onChangeTab={() => setSelectedTab('form')}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default KeywordResearchPage;
