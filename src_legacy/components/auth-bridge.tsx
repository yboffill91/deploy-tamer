"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useAuthStore } from "@/stores/auth-store";
import { updateAuthToken, updateFcmToken } from "@/lib/api/use-authorized-fetch";

export default function AuthBridge() {
  const { isSignedIn, userId, getToken } = useAuth();
  const setBearerToken = useAuthStore((s) => s.setBearerToken);
  const fcmToken = useAuthStore((s) => s.fcmToken);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const handleTokenRefresh = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken({ template: "backend" });
          setBearerToken(token);
          updateAuthToken(token);

          if (fcmToken) {
            updateFcmToken(fcmToken);
          }

          // ✅ Setear cookie pública con userId
          if (userId) {
            document.cookie = `public_user_id=${userId}; path=/; max-age=${60 * 60 * 24}; secure; samesite=lax`;
          }

          // Reset retry count on success
          setRetryCount(0);
        }
      } catch (error: any) {
        console.error("❌ Token refresh failed:", error);

        if (
          error?.message?.includes("Loading chunk") ||
          error?.message?.includes("clerk") ||
          error?.name === "ChunkLoadError"
        ) {
          if (retryCount < maxRetries) {
            console.log(`🔄 Reintentando Clerk (${retryCount + 1}/${maxRetries})...`);
            setRetryCount((prev) => prev + 1);
            setTimeout(() => handleTokenRefresh(), retryCount * 2000 + 1000);
          } else {
            console.log("⚠️ Máximo de reintentos alcanzado, recargando página...");
            setTimeout(() => globalThis.location.reload(), 3000);
          }
        }
      }
    };

    // Escuchar eventos
    const handleTokenExpired = () => handleTokenRefresh();
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error?.message?.includes("Loading chunk") || event.error?.message?.includes("clerk")) {
        event.preventDefault();
        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => handleTokenRefresh(), 1000);
        }
      }
    };

    globalThis.addEventListener("tokenExpired", handleTokenExpired);
    globalThis.addEventListener("error", handleGlobalError);

    // Token inicial
    handleTokenRefresh();

    return () => {
      globalThis.removeEventListener("tokenExpired", handleTokenExpired);
      globalThis.removeEventListener("error", handleGlobalError);
    };
  }, [isSignedIn, userId, getToken, setBearerToken, fcmToken, retryCount]);

  return null;
}
