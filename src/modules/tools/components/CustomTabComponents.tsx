import { TabsTrigger } from "@/components/ui";
import { TabsLists } from "@/modules/tools/utils";
import { cn } from "@/lib/utils";

export const CustomTabTrigger = ({
  tab_name,
  tab_value,
  icon: IconElement,
}: Pick<(typeof TabsLists)[number], "tab_name" | "tab_value" | "icon">) => {
  return (
    <TabsTrigger
      value={tab_value}
      className={cn(
        "data-[state=active]:bg-transparent! data-[state=active]:border-b-4 data-[state=active]:border-x-0 data-[state=active]:border-t-0! rounded-none data-[state=active]:pointer-events-none cursor-pointer data-[state=active]:text-foreground data-[state=active]:font-semibold text-foreground/50 data-[state=active]:shadow-none border-foreground border-0 w-48 md:snap-center snap-start snap-always"
      )}
    >
      <IconElement />
      {tab_name}
    </TabsTrigger>
  );
};
