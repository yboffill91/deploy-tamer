import { useCustomerStore } from "@/stores/use-customer-store";
import { SubscriptionStatus, Subscription } from "@/types/billing";

export const useSubscription = () => {
  const { customer } = useCustomerStore();

  const getSubscriptionStatus = (): SubscriptionStatus => {
    if (!customer?.planStatus) return "incomplete";

    // Mapear los estados del customer a los estados de Stripe
    const statusMap: Record<string, SubscriptionStatus> = {
      active: "active",
      expired: "canceled",
      trial: "trialing",
      suspended: "past_due",
    };

    return statusMap[customer.planStatus] || "incomplete";
  };

  const isSubscriptionExpired = (status: SubscriptionStatus): boolean => {
    return status === "past_due" || status === "unpaid" || status === "canceled" || status === "incomplete_expired";
  };

  const getSubscriptionDetails = (): Subscription | null => {
    if (!customer) return null;

    const status = getSubscriptionStatus();
    const expired = isSubscriptionExpired(status);

    return {
      plan: customer.plan || "free",
      status,
      nextBilling: customer.nextBilling,
      revenue: customer.revenue,
      isExpired: expired,
    };
  };

  const status = getSubscriptionStatus();
  const expired = isSubscriptionExpired(status);

  return {
    subscription: getSubscriptionDetails(),
    isSubscriptionExpired: expired,
    isLoading: !customer,
    customer,
  };
};
