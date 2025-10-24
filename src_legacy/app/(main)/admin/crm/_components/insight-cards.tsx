"use client";

import { Label, Pie, PieChart } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart";

import { Progress } from "@/components/ui/progress";
import { formatCurrency, cn } from "@/lib/utils";

import { leadsBySourceChartData, leadsBySourceChartConfig } from "./crm.config";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCRMEnhanced } from "@/hooks/use-admin-crm-enhanced";

export function InsightCards() {
  const { data, loading } = useAdminCRMEnhanced();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loading && data) {
      setShowSkeleton(false);
    }
  }, [loading, data]);

  const totalSales = data?.regionSales?.reduce((sum, region) => sum + region.sales, 0) ?? 0;
  const totalLeads = data?.leadsBySource?.reduce((acc, curr) => acc + curr.leads, 0) ?? 0;

  if (showSkeleton) {
    return (
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-5">
        {/* Skeleton para Leads by Source */}
        <Card className="col-span-1 xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="max-h-48">
            <Skeleton className="h-48 w-full" />
          </CardContent>
          <CardFooter className="gap-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </CardFooter>
        </Card>

        {/* Skeleton para Sales by Region */}
        <Card className="col-span-1 xl:col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-0.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-5">
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Leads by Source</CardTitle>
        </CardHeader>
        <CardContent className="max-h-48">
          <ChartContainer config={leadsBySourceChartConfig} className="size-full">
            <PieChart
              className="m-0"
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data ? data.leadsBySource : leadsBySourceChartData}
                dataKey="leads"
                nameKey="source"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={2}
                cornerRadius={4}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold tabular-nums"
                          >
                            {totalLeads.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                            Leads
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                content={() => (
                  <ul className="ml-8 flex flex-col gap-3">
                    {data?.leadsBySource.map((item) => (
                      <li key={item.source} className="flex w-36 items-center justify-between">
                        <span className="flex items-center gap-2 capitalize">
                          <span className="size-2.5 rounded-full" style={{ background: item.fill }} />
                          {leadsBySourceChartConfig[item.source].label}
                        </span>
                        <span className="tabular-nums">{item.leads}</span>
                      </li>
                    ))}
                  </ul>
                )}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="mt-auto gap-2">
          <Button size="sm" variant="outline" className="basis-1/2">
            View Full Report
          </Button>
          <Button size="sm" variant="outline" className="basis-1/2">
            Download CSV
          </Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 xl:col-span-3">
        <CardHeader>
          <CardTitle>Sales by Region</CardTitle>
          <CardDescription className="font-medium tabular-nums">
            {formatCurrency(totalSales, { noDecimals: true })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {data?.regionSales.map((region) => (
              <div key={region.region} className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{region.region}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold tabular-nums">
                      {formatCurrency(region.sales, { noDecimals: true })}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium tabular-nums",
                        region.isPositive ? "text-green-500" : "text-destructive",
                      )}
                    >
                      {region.growth}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={region.percentage} />
                  <span className="text-muted-foreground text-xs font-medium tabular-nums">{region.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground flex justify-between gap-1 text-xs">
            <span>{data?.regionSales.length} regions tracked</span>
            <span>•</span>
            <span>{data?.regionSales.filter((r) => r.isPositive).length} regions growing</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
