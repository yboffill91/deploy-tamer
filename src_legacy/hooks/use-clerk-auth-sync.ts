// src/hooks/useClerkAuthSync.ts
"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useAuthStore } from "@/stores/auth-store";
import { setAuthTokens, shouldRefreshToken } from "@/utils/auth";

export function useClerkAuthSync() {
  const { isSignedIn, getToken } = useAuth();
  const setBearerToken = useAuthStore((s) => s.setBearerToken);
  const resetAuth = useAuthStore((s) => s.resetAuth);

  useEffect(() => {
    let mounted = true;

    const sync = async (forceRefresh: boolean = false) => {
      if (isSignedIn) {
        // ✅ Forzar refresco si el token es viejo o si se solicita explícitamente
        if (forceRefresh || shouldRefreshToken()) {
          console.log("🔄 Forcing token refresh...");

          // ✅ Limpiar token viejo primero
          setBearerToken(null);
          setAuthTokens({ bearerToken: null });

          // ✅ Pequeño delay para asegurar que Clerk esté listo
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const token = await getToken({ template: "backend" }).catch(() => null);
        if (mounted && token) {
          setBearerToken(token);
          setAuthTokens({ bearerToken: token });
          console.log("✅ Token updated:", token.substring(0, 20) + "...");
        }
      } else {
        resetAuth();
        setAuthTokens({ bearerToken: null });
      }
    };

    // ✅ Sincronizar inmediatamente y forzar refresco si es necesario
    sync(true);

    const onVis = () => {
      if (document.visibilityState === "visible") sync(true);
    };

    document.addEventListener("visibilitychange", onVis);

    // ✅ También refrescar cada 50 minutos
    const refreshInterval = setInterval(
      () => {
        if (mounted) sync(true);
      },
      50 * 60 * 1000,
    ); // 50 minutos

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(refreshInterval);
    };
  }, [isSignedIn, getToken, setBearerToken, resetAuth]);

  return null;
}
