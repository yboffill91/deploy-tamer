// src/components/providers/CacheSubscriptionProvider.tsx
"use client";

import { useSharedCacheSubscription } from "@/hooks/use-shared-cache-subscription";

export default function CacheSubscriptionProvider({ children }: { children: React.ReactNode }) {
  useSharedCacheSubscription();

  return <>{children}</>;
}
