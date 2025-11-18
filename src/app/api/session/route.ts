import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { idToken, cookie } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "Missing ID Token" },
        { status: 400 }
      );
    }

    const expiresIn = 60 * 60 * 24 * 5;

    const response = NextResponse.json({
      success: true,
      message: "Session cookie set",
    });

    response.cookies.set({
      name: cookie,
      value: idToken,
      maxAge: expiresIn,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error setting session cookie:", error);
    return NextResponse.json(
      { success: false, error: `Error ${error}` },
      { status: 500 }
    );
  }
}
