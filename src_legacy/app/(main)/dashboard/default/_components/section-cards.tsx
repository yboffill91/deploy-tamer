"use client";
import { TrendingUp, TrendingDown, CheckCircle, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomer } from "@/hooks/use-customer";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerStore } from "@/stores/use-customer-store";

export function SectionCards() {
  const { customer } = useCustomerStore();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    // Solo ocultar el skeleton cuando estemos en el cliente,
    // no esté loading Y tengamos customer
    if (customer) {
      setShowSkeleton(false);
    }
  }, [customer]);

  // Mostrar skeletons hasta que tengamos customer real
  if (showSkeleton) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {/* 4 Cards con skeletons de forma completa */}
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
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${customer?.revenue ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Multilink Views</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {customer?.multilinkViews ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Acquisition needs attention</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Delivery Status</CardDescription>
          <CardTitle className="flex items-center text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {customer?.deliveryStatus ?? "Delivered"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <CheckCircle />
              done
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Success <CheckCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">Your card was successfully delivered</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Plan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {customer?.plan ?? "Free Tier"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">{customer?.planStatus ?? "active"}</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Perfect for:</div>
          <div className="text-muted-foreground">Growing teams and agencies</div>
        </CardFooter>
      </Card>
    </div>
  );
}
