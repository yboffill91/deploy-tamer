"use client";
import { TrendingUp, TrendingDown, Loader } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminGeneralEnhanced } from "@/hooks/use-admin-general-enhanced";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionCards() {
  const { data, loading, isCached } = useAdminGeneralEnhanced();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loading && data) {
      setShowSkeleton(false);
    }
  }, [loading, data]);

  const growthRate =
    data?.totalRevenue?.growth && data?.newCustomers?.growth && data?.activeAccount?.growth
      ? (
          (Number(data.totalRevenue.growth) + Number(data.newCustomers.growth) + Number(data.activeAccount.growth)) /
          3
        ).toFixed(2)
      : "0.00";

  if (showSkeleton) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-8 w-1/2" />
              <CardAction>
                <Skeleton className="h-6 w-1/3" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-1 h-3 w-2/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Cards con datos reales (mantener tu código original) */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${data?.totalRevenue?.total ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              {(data?.totalRevenue?.growth ?? 0 >= 0) ? "+" : "-"}
              {data?.totalRevenue?.growth ?? 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {(data?.totalRevenue?.growth ?? 0 >= 0) ? "Trending up this month" : "Trending down this month"}{" "}
            <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          {loading ? (
            <Loader />
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data ? data?.newCustomers.total : 0}
            </CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              <TrendingDown />
              {data ? (data?.newCustomers.growth >= 0 ? "+" : "-") : ""}
              {data ? data?.newCustomers.growth : 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {(data?.newCustomers.growth ?? 0 >= 0) ? "Up" : "Down"} {data ? data?.newCustomers.growth : 0}% this period{" "}
            <TrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Acquisition needs attention</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          {loading ? (
            <Loader />
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data ? data.activeAccount.total : 0}
            </CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              {data ? (data?.activeAccount.growth >= 0 ? "+" : "-") : ""}
              {data ? data?.activeAccount.growth : 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          {loading ? (
            <Loader />
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{growthRate}%</CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              {(growthRate ?? 0 >= 0) ? <TrendingUp /> : <TrendingDown />}
              {growthRate}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>

      {/* Resto de las cards... */}
    </div>
  );
}
