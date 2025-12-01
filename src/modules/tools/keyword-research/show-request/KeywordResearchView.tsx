import { KeywordOverview } from './KeywordOverview';
import { KeywordInsights } from './KeywordInsights';

import type { KeywordResearchEntity } from '@/core/entities';
import { Section } from './Section';
import { KeywordMonthlyTrend } from './KaywordMonthlyTrend';
import { OptionalSection } from './OptionalSection';
import { BadgeList } from './BadgeList';

export function KeywordResearchView({
  research,
}: {
  research: KeywordResearchEntity;
}) {
  return (
    <div className='space-y-8'>
      <Section title='Overview'>
        <KeywordOverview result={research.result ?? undefined} />
      </Section>

      <Section title='Monthly Trend'>
        <KeywordMonthlyTrend data={research.result?.[0]?.monthly_searches} />
      </Section>

      <OptionalSection
        title='Insights'
        data={research.result?.[0]?.monthly_searches}
      >
        <KeywordInsights data={research.result?.[0]?.monthly_searches} />
      </OptionalSection>

      <OptionalSection
        title='Positive Keywords'
        data={research.positiveKeywords}
      >
        <BadgeList items={research.positiveKeywords} />
      </OptionalSection>

      <OptionalSection
        title='Negative Keywords'
        data={research.negativeKeywords}
      >
        <BadgeList items={research.negativeKeywords} />
      </OptionalSection>
    </div>
  );
}
