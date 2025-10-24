"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TokenExpiryHandler() {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  useEffect(() => {
    const handleTokenExpired = () => {
      try {
        // Hacer un refresh suave del router
        router.refresh();
        setRetryCount(0); // Reset on success
      } catch (error: any) {
        console.error("❌ Router refresh failed:", error);

        // Manejar errores de Clerk específicamente
        if (error?.message?.includes("clerk") || error?.message?.includes("chunk")) {
          if (retryCount < maxRetries) {
            console.log(`🔄 Reintentando router refresh (${retryCount + 1}/${maxRetries})...`);
            setRetryCount((prev) => prev + 1);

            setTimeout(
              () => {
                handleTokenExpired();
              },
              retryCount * 1000 + 500,
            );
          } else {
            console.log("🔄 Máximo de reintentos, recargando página completa...");
            globalThis.location.reload();
          }
        }
      }
    };

    // Manejar errores globales de chunks
    const handleChunkError = (event: ErrorEvent) => {
      if (event.error?.message?.includes("Loading chunk") || event.error?.message?.includes("clerk")) {
        event.preventDefault();
        console.log("🔧 Error de chunk, reiniciando router...");
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    };

    globalThis.addEventListener("tokenExpired", handleTokenExpired);
    globalThis.addEventListener("error", handleChunkError);

    return () => {
      globalThis.removeEventListener("tokenExpired", handleTokenExpired);
      globalThis.removeEventListener("error", handleChunkError);
    };
  }, [router, retryCount]);

  return null;
}
