// app/api/stripe/payment-methods/route.ts
import { NextRequest, NextResponse } from "next/server";

// Mock data para métodos de pago
const mockPaymentMethods = [
  {
    id: "pm_1MockVisa123",
    brand: "visa",
    last4: "4242",
    exp_month: 12,
    exp_year: 2026,
    is_default: true,
  },
  {
    id: "pm_1MockMC456",
    brand: "mastercard",
    last4: "4444",
    exp_month: 10,
    exp_year: 2027,
    is_default: false,
  },
  {
    id: "pm_1MockAmex789",
    brand: "american_express",
    last4: "0005",
    exp_month: 3,
    exp_year: 2025,
    is_default: false,
  },
];

export async function GET(request: NextRequest) {
  try {
    // Simular un poco de delay para que parezca real
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verificar autenticación (en un caso real verificarías el JWT)
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Devolver los métodos de pago mock
    return NextResponse.json(mockPaymentMethods);
  } catch (error) {
    console.error("Error en payment-methods endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
