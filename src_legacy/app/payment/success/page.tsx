// app/payment/success/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const customerId = searchParams.get("customerId");
  const plan = searchParams.get("plan");

  useEffect(() => {
    // Simular procesamiento del pago
    const timer = setTimeout(() => {
      console.log("Pago mock procesado para:", { customerId, plan });
    }, 2000);

    return () => clearTimeout(timer);
  }, [customerId, plan]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>¡Pago Exitoso!</CardTitle>
          <CardDescription>Esta es una simulación de página de éxito de pago</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p>
              <strong>Customer ID:</strong> {customerId}
            </p>
            <p>
              <strong>Plan:</strong> {plan}
            </p>
            <p>
              <strong>Estado:</strong> Activo
            </p>
            <p className="text-muted-foreground">
              En un entorno real, esta sería la página de éxito de Stripe Checkout
            </p>
          </div>

          <Button onClick={() => router.push("/dashboard")} className="w-full">
            Volver al Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
