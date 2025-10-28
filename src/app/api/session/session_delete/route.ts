import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const cookieName: string = await req.json();

    if (!cookieName || typeof cookieName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid cookie name' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `Cookie ${cookieName} deleted`,
    });

    response.cookies.delete(cookieName);

    console.log(`Cookie ${cookieName} deleted`);
    return response;
  } catch (error) {
    console.error('Error deleting cookie:', error);
    return NextResponse.json(
      { success: false, error: `Error ${error}` },
      { status: 500 }
    );
  }
}
