import { ReportError } from '../domain-errors';

export interface StatsPrimitive {
  stat: number;
  growth: number;
}

export class Stat {
  constructor(private readonly attributes: StatsPrimitive) {}

  static create(stat: number, growth: number): Stat {
    if (stat < 0) throw ReportError.invalidStat();
    if (growth < -100 || growth > 100) throw ReportError.invalidGrowth();

    return new Stat({ stat, growth });
  }

  get getStat(): number {
    return this.attributes.stat;
  }

  get getGrowth(): number {
    return this.attributes.growth;
  }

  toPrimitives(): StatsPrimitive {
    return { ...this.attributes };
  }
}

export interface TotalVisitorsPrimitive {
  date: string;
  count: number;
}

export class TotalVisitor {
  private constructor(private readonly attributes: TotalVisitorsPrimitive) {}

  static create(date: string, count: number): TotalVisitor {
    if (count < 0) throw ReportError.invalidVisitorCount();
    return new TotalVisitor({ date, count });
  }

  get date() {
    return this.attributes.date;
  }

  get count() {
    return this.attributes.count;
  }

  toPrimitives(): TotalVisitorsPrimitive {
    return { ...this.attributes };
  }
}

export class TotalVisitorsCollection {
  private constructor(private readonly visitors: TotalVisitor[]) {}

  static createFromPrimitives(
    list: TotalVisitorsPrimitive[]
  ): TotalVisitorsCollection {
    const visitors = list.map((item) =>
      TotalVisitor.create(item.date, item.count)
    );
    return new TotalVisitorsCollection(visitors);
  }

  get totalCount(): number {
    return this.visitors.reduce((sum, v) => sum + v.count, 0);
  }

  get items(): TotalVisitor[] {
    return [...this.visitors]; // inmutable copy
  }

  toPrimitives(): TotalVisitorsPrimitive[] {
    return this.visitors.map((v) => v.toPrimitives());
  }
}

export type MonthDistributionItem = {
  month: string;
  mrr: number;
};

export interface trialCardUsersPrimtive {
  percentage: number;
  totalUsers: number;
  trend: number;
}

export class TrialCardUsers {
  constructor(private attributes: trialCardUsersPrimtive) {}
  createPercentageValue(value: number) {
    return (this.attributes.percentage = value);
  }
  createTotalUsers(value: number) {
    return (this.attributes.totalUsers = value);
  }
  createTrend(value: number) {
    return (this.attributes.trend = value);
  }

  getTrialCardUsersPrimitive() {
    return {
      percentage: this.attributes.percentage,
      totalUsers: this.attributes.totalUsers,
      trend: this.attributes.trend,
    };
  }
}

export type RetentionStatsPrimitive = {
  day30: number;
  day90: number;
  trend: number;
};

export class RetentionStats {
  constructor(private attributes: RetentionStatsPrimitive) {}

  createDay30Value(value: number) {
    return (this.attributes.day30 = value);
  }
  createDay90Value(value: number) {
    return (this.attributes.day90 = value);
  }
  createTrendValue(value: number) {
    return (this.attributes.trend = value);
  }

  getTetentionStatsPrimitive() {
    return {
      ...this.attributes,
    };
  }
}

export interface UpgradesStatsPrimitive {
  free: number;
  pro: number;
  lite: number;
  max: number;
  trend: number;
}

export class UpgradesStats {
  constructor(private attributes: UpgradesStatsPrimitive) {}
  createFreeValue(value: number) {
    return (this.attributes.free = value);
  }
  createProValue(value: number) {
    return (this.attributes.pro = value);
  }
  createLiteValue(value: number) {
    return (this.attributes.lite = value);
  }
  createMaxValue(value: number) {
    return (this.attributes.max = value);
  }
  createTrendValue(value: number) {
    return (this.attributes.trend = value);
  }

  getUpgradesStatsPrimitive() {
    return {
      free: this.attributes.free,
      pro: this.attributes.pro,
      lite: this.attributes.lite,
      max: this.attributes.max,
      trend: this.attributes.trend,
    };
  }
}

export interface RevenueStatsPrimitive {
  mrr: number;
  arr: number;
  growth: number;
}

export class RevenueStats {
  constructor(private attributes: RevenueStatsPrimitive) {}

  createMrrValue(value: number) {
    this.attributes.mrr = value;
  }
  createArrValue(value: number) {
    this.attributes.arr = value;
  }
  createGrowthValue(value: number) {
    this.attributes.growth = value;
  }

  getRevenueStatsPrimitive() {
    return {
      mrr: this.attributes.mrr,
      arr: this.attributes.arr,
      growth: this.attributes.growth,
    };
  }
}
