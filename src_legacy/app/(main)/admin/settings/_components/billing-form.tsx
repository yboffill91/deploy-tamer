"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useBilling } from "@/hooks/Stripe/use-billing"; // Ruta corregida
import { useSubscription } from "@/hooks/Stripe/use-subscription"; // Ruta corregida
import { useCustomerStore } from "@/stores/use-customer-store";

const PLAN_TO_PRICE_ID = {
  lite: "price_1S7mAyHsIkprzs9Kikq1zyHB", // Reemplaza con el priceId real para lite
  pro: "price_1S7mAyHsIkprzs9Kikq1zyHB", // Reemplaza con el priceId real para pro
  max: "price_1S7mAyHsIkprzs9Kikq1zyHB", // Reemplaza con el priceId real para max
} as const;

type PlanType = keyof typeof PLAN_TO_PRICE_ID;

export default function BillingForm() {
  const { customer } = useCustomerStore();
  const { subscription, isSubscriptionExpired, isLoading: subscriptionLoading } = useSubscription();
  const { isLoading: isOperationsLoading, isPortalLoading, openCustomerPortal, createSubscription } = useBilling(); // Pasar customer como parámetro
  // En tu componente, agrega esta constante al inicio

  const isLoading = subscriptionLoading;

  if (isLoading) {
    return (
      <div className="mx-auto w-full space-y-8 p-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const handleRenewSubscription = () => {
    if (!customer?.plan) {
      toast.error("No plan selected");
      return;
    }

    // Convertir el nombre del plan a priceId
    const priceId = PLAN_TO_PRICE_ID[customer.plan as PlanType];
    if (!priceId) {
      toast.error("Invalid plan configuration");
      return;
    }

    createSubscription(priceId);
  };

  const handleUpgradePlan = (plan: string) => {
    // Convertir el nombre del plan a priceId
    const priceId = PLAN_TO_PRICE_ID[plan as PlanType];
    if (!priceId) {
      toast.error("Invalid plan selected");
      return;
    }

    createSubscription(priceId);
  };

  return (
    <div className="mx-auto h-[55vh] w-full space-y-8 overflow-y-auto p-6">
      {/* Alerta de suscripción vencida */}
      {isSubscriptionExpired && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Subscription Expired</AlertTitle>
          <AlertDescription>
            Your subscription has expired. Please renew to continue accessing premium features.
            <Button variant="outline" className="ml-4" onClick={handleRenewSubscription} disabled={isOperationsLoading}>
              {isOperationsLoading ? "Processing..." : "Renew Now"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Información de suscripción */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>Your current plan and billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-sm font-medium">
              <DollarSign className="mr-2 h-4 w-4" />
              Current Plan
            </span>
            <Badge variant={isSubscriptionExpired ? "destructive" : "outline"} className="capitalize">
              {subscription?.plan} • {subscription?.status}
            </Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="flex items-center text-sm font-medium">
              <Calendar className="mr-2 h-4 w-4" />
              Next Billing Date
            </span>
            <span className="text-muted-foreground text-sm">
              {subscription?.nextBilling
                ? new Date(subscription.nextBilling).toLocaleDateString()
                : "No upcoming billing"}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Revenue</span>
            <span className="text-muted-foreground text-sm">${subscription?.revenue?.toFixed(2) || "0.00"}</span>
          </div>

          {isSubscriptionExpired && (
            <>
              <Separator />
              <div className="py-4 text-center">
                <Button onClick={handleRenewSubscription} disabled={isOperationsLoading} className="w-full">
                  {isOperationsLoading ? "Processing..." : "Renew Subscription"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Opciones de plan */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Plan</CardTitle>
          <CardDescription>Choose a plan that fits your needs</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {["lite", "pro", "max"].map((plan) => (
            <Card key={plan} className="text-center">
              <CardHeader>
                <CardTitle className="capitalize">{plan}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleUpgradePlan(plan)}
                  disabled={isOperationsLoading || subscription?.plan === plan}
                  variant={subscription?.plan === plan ? "default" : "outline"}
                >
                  {subscription?.plan === plan ? "Current Plan" : "Upgrade to " + plan}
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Portal de cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Portal</CardTitle>
          <CardDescription>Access your complete billing history and manage subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={openCustomerPortal} disabled={isPortalLoading} className="w-full">
            {isPortalLoading ? "Redirecting..." : "Open Stripe Customer Portal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
