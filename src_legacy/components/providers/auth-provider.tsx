// src/providers/AuthProvider.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useAuthStore } from "@/stores/auth-store";
import { updateAuthToken, updateFcmToken } from "@/lib/api/use-authorized-fetch";
import { Loader2 } from "lucide-react";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);
  const setBearerToken = useAuthStore((s) => s.setBearerToken);
  const setFcmToken = useAuthStore((s) => s.setFcmToken);
  const fcmToken = useAuthStore((s) => s.fcmToken);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isLoaded) return;

      try {
        if (isSignedIn) {
          // ✅ Obtener token de Clerk
          const clerkToken = await getToken({ template: "backend" });
          setBearerToken(clerkToken);
          updateAuthToken(clerkToken);

          // ✅ Actualizar FCM token si existe
          if (fcmToken) {
            updateFcmToken(fcmToken);
          }
        } else {
          setBearerToken(null);
          updateAuthToken(null);
        }
      } catch (error) {
        console.error("❌ Auth initialization failed:", error);
        setBearerToken(null);
        updateAuthToken(null);
      } finally {
        setIsTokenLoaded(true);
      }
    };

    initializeAuth();
  }, [isLoaded, isSignedIn, getToken, setBearerToken, fcmToken]);

  // ✅ Mostrar loading hasta que todo esté cargado
  if (!isLoaded || !isTokenLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
