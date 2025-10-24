// env.ts

if (process.env.NEXT_RUNTIME !== "edge") {
  const dotenv = require("dotenv");
  dotenv.config({ override: false }); // override false evita sobreescribir variables existentes
}

export const env = {
  // ==================== DETECCIÓN DE ENTORNO ====================
  environment: process.env.NODE_ENV || "development",
  get isProduction() {
    return this.environment === "production";
  },
  get isDevelopment() {
    return this.environment === "development";
  },
  get isTest() {
    return this.environment === "test";
  },

  // ==================== CLERK AUTHENTICATION ====================
  clerk: {
    get publishableKey() {
      const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      if (env.isProduction && !key) {
        console.error("❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required in production");
      }
      return key;
    },/* 
    get secretKey() {
      const key = process.env.CLERK_SECRET_KEY;
      if (env.isProduction && !key) {
        throw new Error("❌ CLERK_SECRET_KEY is required in production");
      } else if (env.isDevelopment && !key) {
        console.warn("⚠️ CLERK_SECRET_KEY is missing in development");
      }
      return key;
    }, */
  },

  // ==================== API CONFIGURATION ====================
  api: {
    get baseUrl() {
      return (
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        (env.isProduction ? "https://api.tuapp.com" : "http://localhost:4000")
      );
    },
    get url() {
      const base = this.baseUrl.endsWith("/") ? this.baseUrl.slice(0, -1) : this.baseUrl;
      return base;
    },
    get timeout() {
      return env.isProduction ? 10000 : 30000;
    },
  },

  // ==================== STRIPE CONFIGURATION ====================
  stripe: {
    endpoints: {
      createPaymentIntent: "/api/payments/create-intent",
      customerPortal: "/api/stripe/customer-portal",
      createSubscription: "/billing/create-checkout-session",
      webhook: "/api/stripe/webhook",
    },
    redirects: {
      success: process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL || "/payment/success",
      cancel: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL || "/dashboard/billing?payment=cancelled",
      return: process.env.NEXT_PUBLIC_STRIPE_RETURN_URL || "/dashboard/billing",
    },
  },

  // ==================== AUTH CONFIGURATION ====================
  auth: {
    get allowedUserId() {
      return process.env.NEXT_PUBLIC_ALLOWED_USER_ID;
    },
  },

  // ==================== FEATURE FLAGS ====================
  features: {
    get debugMode() {
      return process.env.NEXT_PUBLIC_DEBUG_MODE === "true" || env.isDevelopment;
    },
    stripe: {
      get paymentIntents() {
        return process.env.NEXT_PUBLIC_FEATURE_STRIPE_PAYMENT_INTENTS !== "false";
      },
      get customerPortal() {
        return process.env.NEXT_PUBLIC_FEATURE_STRIPE_CUSTOMER_PORTAL !== "false";
      },
      get subscriptions() {
        return process.env.NEXT_PUBLIC_FEATURE_STRIPE_SUBSCRIPTIONS !== "false";
      },
    },
  },
};

// ==================== FUNCIONES ÚTILES ====================
export const getApiConfig = () => ({
  baseURL: env.api.url,
  timeout: env.api.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const getStripeEndpoint = (endpoint: keyof typeof env.stripe.endpoints): string =>
  `${env.api.url}${env.stripe.endpoints[endpoint]}`;

export type EnvType = typeof env;

export default env;
