import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { MVPSuccessMetrics } from "./_components/mvp-success-metrics";
import { SectionCards } from "./_components/section-cards";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <MVPSuccessMetrics />
    </div>
  );
}
