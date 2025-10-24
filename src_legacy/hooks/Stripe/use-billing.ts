import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { env } from '@/config/env';
import { billingApi } from '@/lib/api/billing';
import { useBillingStore } from '@/stores/use-billing-store';

export const useBilling = () => {
  const { setPortalLoading } = useBillingStore();

  // Mutación para portal de cliente
  const customerPortalMutation = useMutation({
    mutationFn: () => billingApi.createCustomerPortalSession(),
  });

  // Efecto para manejar el estado de carga del portal
  useEffect(() => {
    setPortalLoading(customerPortalMutation.isPending);
  }, [customerPortalMutation.isPending, setPortalLoading]);

  // Efecto para manejar éxito del portal
  useEffect(() => {
    if (customerPortalMutation.data?.url) {
      globalThis.open(customerPortalMutation.data.url, '_blank');
    }
  }, [customerPortalMutation.data]);

  // Efecto para manejar errores del portal
  useEffect(() => {
    if (customerPortalMutation.error) {
      console.error('Failed to create portal session:', customerPortalMutation.error);
      toast.error('Failed to access customer portal');
    }
  }, [customerPortalMutation.error]);

  // Mutación para crear suscripción
  const subscriptionMutation = useMutation({
    mutationFn: (data: { priceId: string; successUrl: string; cancelUrl: string }) => {
      return billingApi.createSubscription(data);
    },
  });

  // Función expuesta para iniciar la suscripción
  const createSubscription = (priceId: string) => {
    if (!env.features.stripe.subscriptions) {
      toast.error('Subscription feature is currently unavailable');
      return;
    }

    const successUrl = `${globalThis.location.origin}/payment/success`;
    const cancelUrl = `${globalThis.location.origin}/cancel`;

    subscriptionMutation.mutate({ priceId, successUrl, cancelUrl });
  };

  // Efecto para manejar éxito del checkout
  useEffect(() => {
    if (subscriptionMutation.data?.url) {
      // Redirige al usuario directamente a Stripe Checkout
      globalThis.location.href = subscriptionMutation.data.url;
    }
  }, [subscriptionMutation.data]);

  // Mutación para crear payment intent (si es necesario)
  const paymentIntentMutation = useMutation({
    mutationFn: () => billingApi.createPaymentIntent(),
  });

  const openCustomerPortal = () => {
    if (!env.features.stripe.customerPortal) {
      toast.error('Customer portal feature is currently unavailable');
      return;
    }
    customerPortalMutation.mutate();
  };

  const createPaymentIntent = () => {
    if (!env.features.stripe.paymentIntents) {
      toast.error('Payment intent feature is currently unavailable');
      return;
    }
    paymentIntentMutation.mutate();
  };

  return {
    openCustomerPortal,
    createSubscription,
    createPaymentIntent,
    isLoading: subscriptionMutation.isPending || paymentIntentMutation.isPending,
    isPortalLoading: customerPortalMutation.isPending,
    subscriptionData: subscriptionMutation.data,
    paymentIntentData: paymentIntentMutation.data,
  };
};
