"use client";

import { format, subMonths } from "date-fns";
import { Wallet, BadgeDollarSign, Loader } from "lucide-react";
import { Area, AreaChart, Line, LineChart, Bar, BarChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import {
  leadsChartData,
  leadsChartConfig,
  proposalsChartData,
  proposalsChartConfig,
  revenueChartData,
  revenueChartConfig,
} from "./crm.config";
import { useAdminCRMEnhanced } from "@/hooks/use-admin-crm-enhanced";
import { useAdminGeneralEnhanced } from "@/hooks/use-admin-general-enhanced";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const lastMonth = format(subMonths(new Date(), 1), "LLLL");

export function OverviewCards() {
  const { data, loading } = useAdminCRMEnhanced();
  const revenue = useAdminGeneralEnhanced();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loading && data && !revenue.loading && revenue.data) {
      setShowSkeleton(false);
    }
  }, [loading, data, revenue.loading, revenue.data]);

  const sumaNewLeads =
    data?.leadsChart?.reduce((acumulador, lead) => {
      return acumulador + lead.newLeads;
    }, 0) ?? 0;

  if (showSkeleton) {
    return (
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item}>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="size-full">
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-6 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader>
          <CardTitle>New Leads</CardTitle>
          <CardDescription>Last Month</CardDescription>
        </CardHeader>
        <CardContent className="size-full">
          {loading ? (
            <Loader />
          ) : (
            <ChartContainer className="size-full min-h-24" config={leadsChartConfig}>
              <BarChart accessibilityLayer data={data?.leadsChart} barSize={8}>
                <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
                <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => `${lastMonth}: ${label}`} />} />
                <Bar
                  background={{ fill: "var(--color-background)", radius: 4, opacity: 0.07 }}
                  dataKey="newLeads"
                  stackId="a"
                  fill="var(--color-newLeads)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar dataKey="disqualified" stackId="a" fill="var(--color-disqualified)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-xl font-semibold tabular-nums">{sumaNewLeads}</span>
          <span className="text-sm font-medium text-green-500">+54.6%</span>
        </CardFooter>
      </Card>

      <Card className="overflow-hidden pb-0">
        <CardHeader>
          <CardTitle>Proposals Sent</CardTitle>
          <CardDescription>Last Month</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {loading ? (
            <Loader />
          ) : (
            <ChartContainer className="size-full min-h-24" config={proposalsChartConfig}>
              <AreaChart
                data={data?.proposalsChart}
                margin={{
                  left: 0,
                  right: 0,
                  top: 5,
                }}
              >
                <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
                <ChartTooltip
                  content={<ChartTooltipContent labelFormatter={(label) => `${lastMonth}: ${label}`} hideIndicator />}
                />
                <Area
                  dataKey="proposalsSent"
                  fill="var(--color-proposalsSent)"
                  fillOpacity={0.05}
                  stroke="var(--color-proposalsSent)"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="w-fit rounded-lg bg-green-500/10 p-2">
            <Wallet className="size-5 text-green-500" />
          </div>
        </CardHeader>
        <CardContent className="flex size-full flex-col justify-between">
          <div className="space-y-1.5">
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Last 6 Months</CardDescription>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div>
              <p className="text-2xl font-medium tabular-nums">${revenue.data?.totalRevenue.total}</p>
              <div className="w-fit rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                +{revenue.data?.totalRevenue.growth}%
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div
            className={`${(data?.projectsWon.growth ?? 0 >= 0) ? "bg-green-500/10 text-green-500" : "text-destructive bg-destructive/10"} w-fit rounded-lg p-2`}
          >
            <BadgeDollarSign
              className={`${(data?.projectsWon.growth ?? 0 >= 0) ? "bg-green-500/10 text-green-500" : "text-destructive bg-destructive/10"} size-5`}
            />
          </div>
        </CardHeader>
        <CardContent className="flex size-full flex-col justify-between">
          <div className="space-y-1.5">
            <CardTitle>Projects Won</CardTitle>
            <CardDescription>Last 6 Months</CardDescription>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div>
              <p className="text-2xl font-medium tabular-nums">{data?.projectsWon.total}</p>
              <div
                className={`${(data?.projectsWon.growth ?? 0 >= 0) ? "bg-green-500/10 text-green-500" : "text-destructive bg-destructive/10"} w-fit rounded-md px-2 py-1 text-xs font-medium`}
              >
                {(data?.projectsWon.growth ?? 0 >= 0) ? "+" : "-"}
                {data?.projectsWon.growth}%
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
          <CardDescription>Year to Date (YTD)</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader />
          ) : (
            <ChartContainer config={revenueChartConfig} className="h-24 w-full">
              <LineChart
                data={data?.revenueChart.data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  strokeWidth={2}
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            {(data?.revenueChart.growth ?? 0 >= 0) ? "+" : "-"}
            {data?.revenueChart.growth}% growth since last year
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
