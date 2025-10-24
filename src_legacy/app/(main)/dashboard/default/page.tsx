import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { SectionCards } from "./_components/section-cards";
import { TableCards } from "./_components/table-cards";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <TableCards />
    </div>
  );
}
