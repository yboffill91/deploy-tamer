import {
  MonthDistributionItem,
  RetentionStats,
  RevenueStats,
  Stat,
  TotalVisitorsCollection,
  TrialCardUsers,
  UpgradesStats,
} from '@/core/value-objects';

type GeneralReportPrimitives = {
  totalRevenue: { stat: number; growth: number };
  newCustomers: { stat: number; growth: number };
  activeAccount: { stat: number; growth: number };
  totalVisitors: TotalVisitorsCollection;
  monthDistribution: MonthDistributionItem[];
  trialCardUsers: TrialCardUsers;
  retention: RetentionStats;
  upgrades: UpgradesStats;
  revenue: RevenueStats;
};

export class GeneralReport {
  private constructor(
    private totalRevenue: Stat,
    private newCustomers: Stat,
    private activeAccount: Stat,
    private totalVisitors: TotalVisitorsCollection,
    private monthDistribution: MonthDistributionItem[],
    private trialCardUsers: TrialCardUsers,
    private retention: RetentionStats,
    private upgrades: UpgradesStats,
    private revenue: RevenueStats
  ) {}

  public static create(payload: GeneralReportPrimitives): GeneralReport {
    // const totalRevenueVO = new Stat({
    //   stat: payload.totalRevenue.stat,
    //   growth: payload.totalRevenue.growth,
    // });

    // const newCustomersVO = new Stat({
    //   stat: payload.newCustomers.stat,
    //   growth: payload.newCustomers.growth,
    // });

    // const activeAccountVO = new Stat({
    //   stat: payload.activeAccount.stat,
    //   growth: payload.activeAccount.growth,
    // });

    return new GeneralReport(
      Stat.create(payload.totalRevenue.stat, payload.totalRevenue.growth),
      Stat.create(payload.newCustomers.stat, payload.newCustomers.growth),
      Stat.create(payload.activeAccount.stat, payload.activeAccount.growth),
      // TotalVisitorsCollection.createFromPrimitives(payload.totalVisitors),
      payload.totalVisitors,
      payload.monthDistribution,
      payload.trialCardUsers,
      payload.retention,
      payload.upgrades,
      payload.revenue
    );
  }

  // ejemplo de getter
  public getTotalRevenue(): Stat {
    return this.totalRevenue;
  }
}
