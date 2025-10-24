// app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from "next/server";

// Precios mock para diferentes planes
const mockPrices = {
  lite: "price_mock_lite_123",
  pro: "price_mock_pro_456",
  max: "price_mock_max_789",
};

export async function POST(request: NextRequest) {
  try {
    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Verificar autenticación
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parsear el cuerpo de la solicitud
    const body = await request.json();
    const { customerId, plan } = body;

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const planKey = (plan || "pro") as keyof typeof mockPrices;
    const priceId = mockPrices[planKey] || mockPrices.pro;

    // URL mock de checkout (en desarrollo redirige a una página de éxito)
    const successUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard?payment=success`;
    const cancelUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/billing?payment=cancelled`;

    const checkoutUrl = `/payment/success?customerId=${customerId}&plan=${plan}`;

    return NextResponse.json({
      url: checkoutUrl,
      success_url: successUrl,
      cancel_url: cancelUrl,
      price_id: priceId,
      customer_id: customerId,
      message: "Mock Checkout Session - En producción esto redirigiría a Stripe Checkout",
    });
  } catch (error) {
    console.error("Error en create-checkout endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
