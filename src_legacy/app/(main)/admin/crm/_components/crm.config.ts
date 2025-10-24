 

import { ChartConfig } from "@/components/ui/chart";

export const leadsChartData = [
  { date: "1-5", newLeads: 0, disqualified: 0 },
  { date: "6-10", newLeads: 0, disqualified: 0 },
  { date: "11-15", newLeads: 0, disqualified: 0 },
  { date: "16-20", newLeads: 0, disqualified: 0 },
  { date: "21-25", newLeads: 0, disqualified: 0 },
  { date: "26-30", newLeads: 0, disqualified: 0 },
];

export const leadsChartConfig = {
  newLeads: {
    label: "New Leads",
    color: "var(--chart-1)",
  },
  disqualified: {
    label: "Disqualified",
    color: "var(--chart-3)",
  },
  background: {
    color: "var(--primary)",
  },
} as ChartConfig;

export const proposalsChartData = [
  { date: "1-5", proposalsSent: 0 },
  { date: "6-10", proposalsSent: 0 },
  { date: "11-15", proposalsSent: 0 },
  { date: "16-20", proposalsSent: 0 },
  { date: "21-25", proposalsSent: 0 },
  { date: "26-30", proposalsSent: 0 },
];

export const proposalsChartConfig = {
  proposalsSent: {
    label: "Proposals Sent",
    color: "var(--chart-1)",
  },
} as ChartConfig;

export const revenueChartData = [
  { month: "Jul 2024", revenue: 0 },
  { month: "Aug 2024", revenue: 0 },
  { month: "Sep 2024", revenue: 0 },
  { month: "Oct 2024", revenue: 0 },
  { month: "Nov 2024", revenue: 0 },
  { month: "Dec 2024", revenue: 0 },
  { month: "Jan 2025", revenue: 0 },
  { month: "Feb 2025", revenue: 0 },
  { month: "Mar 2025", revenue: 0 },
  { month: "Apr 2025", revenue: 0 },
  { month: "May 2025", revenue: 0 },
  { month: "Jun 2025", revenue: 0 },
];

export const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} as ChartConfig;

export const leadsBySourceChartData = [
  { source: "website", leads: 0, fill: "var(--color-website)" },
  { source: "referral", leads: 0, fill: "var(--color-referral)" },
  { source: "social", leads: 0, fill: "var(--color-social)" },
  { source: "cold", leads: 0, fill: "var(--color-cold)" },
  { source: "other", leads: 0, fill: "var(--color-other)" },
];

export const leadsBySourceChartConfig = {
  leads: {
    label: "Leads",
  },
  website: {
    label: "Website",
    color: "var(--chart-1)",
  },
  referral: {
    label: "Referral",
    color: "var(--chart-2)",
  },
  social: {
    label: "Social Media",
    color: "var(--chart-3)",
  },
  cold: {
    label: "Cold Outreach",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} as ChartConfig;

export const regionSalesData = [
  {
    region: "North America",
    sales: 0,
    percentage: 0,
    growth: "0%",
    isPositive: true,
  },
  {
    region: "Europe",
    sales: 0,
    percentage: 0,
    growth: "0%",
    isPositive: true,
  },
  {
    region: "Asia Pacific",
    sales: 0,
    percentage: 0,
    growth: "0%",
    isPositive: true,
  },
  {
    region: "Latin America",
    sales: 0,
    percentage: 0,
    growth: "0%",
    isPositive: true,
  },
  {
    region: "Middle East & Africa",
    sales: 0,
    percentage: 0,
    growth: "0%",
    isPositive: true,
  },
];
