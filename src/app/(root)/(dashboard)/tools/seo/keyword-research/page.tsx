import { Tabs, TabsContent, TabsList } from '@/components/ui';
import { TabsLists } from '@/modules/tools/utils/key_research_data';
import { CustomTabTrigger } from '@/modules/tools/components';

const KeywordResearchPage = () => {
  return (
    <div className=''>
      <Tabs defaultValue={TabsLists[0].tab_value}>
        <TabsList className='w-full flex shrink-0 items-center justify-start bg-transparent  border-b p-0 mb-2 rounded-none overflow-x-auto snap-none md:snap-x md:snap-mandatory snap-always'>
          {TabsLists.map((tab) => (
            <CustomTabTrigger
              key={tab.tab_value}
              tab_name={tab.tab_name}
              tab_value={tab.tab_value}
              icon={tab.icon}
            />
          ))}
        </TabsList>
        {TabsLists.map((tab) => (
          <TabsContent value={tab.tab_value} key={tab.tab_value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default KeywordResearchPage;
