import { env } from '@/config/env';
import { CreateSubscriptionRequest, CreateCustomerPortalSessionResponse } from '@/types/billing';

import { authorizedFetch } from './use-authorized-fetch';

export const billingApi = {
  createCustomerPortalSession: async (): Promise<CreateCustomerPortalSessionResponse> => {
    const fullUrl = `${env.api.url}${env.stripe.endpoints.customerPortal}`;

    const result = await authorizedFetch<{ url: string }>(fullUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: globalThis.location.origin,
      },
      credentials: 'include',
    });

    return { url: result.url };
  },

  createSubscription: async (
    data: CreateSubscriptionRequest & { successUrl: string; cancelUrl: string },
  ): Promise<{ url: string }> => {
    const fullUrl = `${env.api.url}${env.stripe.endpoints.createSubscription}`;

    const requestBody = {
      priceId: data.priceId,
      successUrl: data.successUrl,
      cancelUrl: data.cancelUrl,
    };

    // Llamada al backend que devuelve la URL de Stripe Checkout
    const result = await authorizedFetch<{ url: string }>(fullUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: globalThis.location.origin,
      },
      credentials: 'include',
      body: JSON.stringify(requestBody),
    });

    return result;
  },

  createPaymentIntent: async (): Promise<{ clientSecret: string }> => {
    const fullUrl = `${env.api.url}${env.stripe.endpoints.createPaymentIntent}`;

    const result = await authorizedFetch<{ clientSecret: string }>(fullUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: globalThis.location.origin,
      },
      credentials: 'include',
      body: JSON.stringify({}),
    });

    return result;
  },
};
