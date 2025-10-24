// app/api/stripe/customer-portal/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Leer el body correctamente
    const body = await req.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
    }

    // Simulación de URL del portal
    const mockPortalUrl = `https://mock-stripe-portal.com/customer/${customerId}`;

    console.log(`[MOCK] Redirecting customer ${customerId} to: ${mockPortalUrl}`);

    return NextResponse.json({ url: mockPortalUrl });
  } catch (error: any) {
    console.error("[MOCK ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
