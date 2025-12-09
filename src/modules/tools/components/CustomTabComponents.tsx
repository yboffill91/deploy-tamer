import { TabsTrigger } from '@/components/ui';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export const CustomTabTrigger = ({
  tab_name,
  tab_value,
  icon: IconElement,
}: {
  tab_name: string;
  tab_value: string;
  icon: LucideIcon;
}) => {
  return (
    <TabsTrigger
      value={tab_value}
      className={cn(
        ' data-[state=active]:border-b-4 data-[state=active]:border-x-0 data-[state=active]:border-t-0!  data-[state=active]:pointer-events-none cursor-pointer data-[state=active]:text-foreground data-[state=active]:font-semibold text-foreground/50 data-[state=active]:shadow-none border-foreground border-0  md:snap-center snap-start snap-always '
      )}
    >
      <IconElement />
      {tab_name}
    </TabsTrigger>
  );
};
