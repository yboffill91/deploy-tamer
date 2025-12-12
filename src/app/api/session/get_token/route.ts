import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = await req.cookies.get('TS_SESSION');

    if (token) {
      return NextResponse.json(
        { success: true, token: token },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: false, token: null }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: `Internal Error ${e}` }, { status: 500 });
  }
}
