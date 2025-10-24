"use client";
import { useBilling } from "@/hooks/Stripe/use-billing";
import { SubscriptionStatus } from "@/types/billing";
import { useCustomerStore } from "@/stores/use-customer-store";
import { Button } from "./ui/button";

export function RenovateSuscription() {
  const { customer } = useCustomerStore();
  const planStatus = customer?.planStatus as SubscriptionStatus | undefined;
  const needsNewSubscription = (status?: SubscriptionStatus): boolean => {
    if (!status) return false; // undefined → no necesita nueva suscripción
    return (
      status === "past_due" ||
      status === "unpaid" ||
      status === "incomplete" ||
      status === "incomplete_expired" ||
      status === "canceled"
    );
  };
  const { createSubscription } = useBilling();

  return (
    <>
      {needsNewSubscription(planStatus) && (
        <div className="flex items-center gap-4">
          <p className="text-sidebar-foreground/70 text-sm">Your suscription was expired</p>
          <Button onClick={() => createSubscription("price_1S7mAyHsIkprzs9Kikq1zyHB")} className="cursor-pointer">
            Renew suscription
          </Button>
        </div>
      )}
    </>
  );
}
