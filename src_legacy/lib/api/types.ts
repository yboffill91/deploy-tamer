// src/lib/api/types.ts

// ---------- /api/general ----------
type Stat = { total: number; growth: number };

export type TotalVisitorsItem = {
  date: string;
  desktop: number;
  mobile: number;
};

export type PlanDistributionItem = {
  plan: "Lite" | "Pro" | "Max" | string;
  revenue: number;
  customers: number;
};

export type MonthDistributionItem = {
  month: string;
  mrr: number;
};

// Nuevos tipos para las métricas de éxito del MVP
export type TrialCardUsers = {
  percentage: number;
  totalUsers: number;
  trend: number;
};

export type RetentionStats = {
  day30: number;
  day90: number;
  trend: number;
};

export type UpgradesStats = {
  free: number;
  pro: number;
  lite: number;
  max: number;
  trend: number;
};

export type RevenueStats = {
  mrr: number;
  arr: number;
  growth: number;
};

export interface GeneralResponse {
  totalRevenue: Stat;
  newCustomers: Stat;
  activeAccount: Stat;
  totalVisitors: TotalVisitorsItem[];
  planDistribution: PlanDistributionItem[];
  monthDistribution: MonthDistributionItem[];

  // Nuevas propiedades para métricas de éxito del MVP
  trialCardUsers: TrialCardUsers;
  retention: RetentionStats;
  upgrades: UpgradesStats;
  revenue: RevenueStats;
}

// ---------- /api/crm ----------
export type LeadsChartItem = { date: string; newLeads: number; disqualified: number };
export type ProposalsChartItem = { date: string; proposalsSent: number };
export type RevenueDataPoint = {
  month: string;
  revenue: number;
};

export type RevenueChart = {
  data: RevenueDataPoint[];
  growth: number;
};
export type ProjectsWon = { total: number; growth: number };
export type LeadsBySourceItem = {
  source: string;
  leads: number;
  fill: string;
};

export type RegionSalesItem = {
  region: string;
  sales: number;
  percentage: number;
  growth: string;
  isPositive: boolean;
};

export type ActionItem = {
  id: number;
  title: string;
  desc?: string;
  due?: string;
  priority?: "High" | "Medium" | "Low";
  priorityColor?: string;
  checked?: boolean;
};

export type RecentLead = {
  id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  lastActivity: string;
};

export interface CRMResponse {
  leadsChart: LeadsChartItem[];
  projectsWon: ProjectsWon;
  proposalsChart: ProposalsChartItem[];
  revenueChart: RevenueChart;
  leadsBySource: LeadsBySourceItem[];
  regionSales: RegionSalesItem[];
  actionItems: ActionItem[];
  recentLeads: RecentLead[];
}

// ---------- /api/customers & /api/customer/:id ----------

export type Social = {
  instagram?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  dribbble?: string;
  behance?: string;
  github?: string;
  stackoverflow?: string;
};

export type MultilinkData = {
  primaryColor: string;
  name: string;
  email: string;
  title: string;
  description: string;
  social: Social;
  offers: number;
  products: number;
  totalViews: number;
};

export type Customer = {
  _id: string; // viene de MongoDB
  username: string;
  email: string;
  name: string;
  plan: "lite" | "pro" | "max";
  planStatus: "active" | "expired" | "trial" | "suspended";
  deliveryStatus: "delivered" | "shipped" | "processing" | "pending" | "failed" | string;
  createdAt: string; // ISO
  lastLogin: string; // ISO
  updatedAt: string; // ISO
  revenue: number;
  multilinkViews: number;
  location?: string;
  paymentMethod?: string;
  nextBilling?: string; // ISO
  multilinkData: MultilinkData;
  __v?: number; // versión del documento de MongoDB
};
export type CustomerMeResponse = {
  customer: Customer;
  recentLeads: RecentLead[]; // o define un tipo específico para leads
  totalVisitors: TotalVisitorsItem[]; // o define un tipo específico para visitors
};

export type CustomersResponse = {
  customers: Customer[];
  total: number;
};
