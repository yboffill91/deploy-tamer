"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      // Si ya está logueado, redirige al dashboard
      router.replace("/dashboard/default");
    }
  }, [isSignedIn, router]);

  // Evita renderizar SignIn si ya hay sesión
  if (isSignedIn) return null;

  return (
    <SignIn
      path="/auth/v2/login" forceRedirectUrl="/dashboard/default" routing="path" signUpUrl="/auth/v2/register"
    />
  );
}
