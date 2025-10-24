export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "unpaid"
  | "undefined";

export type Subscription = {
  plan: string;
  status: SubscriptionStatus;
  nextBilling?: string;
  revenue?: number;
  isExpired: boolean;
};

export type Customer = {
  _id: string;
  clerk_id: string;
  plan?: string;
  planStatus?: string;
  nextBilling?: string;
  revenue?: number;
};

export interface CreateCustomerPortalSessionResponse {
  url: string;
}

export interface CreateSubscriptionRequest {
  priceId: string;
}

export interface CreateSubscriptionResponse {
  subscriptionId: string;
  clientSecret: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
}
