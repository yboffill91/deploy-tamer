import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const raw = (await cookies()).get('TS_USER')?.value;

  if (!raw) {
    return NextResponse.json({ success: false, user: null }, { status: 200 });
  }

  try {
    const user = JSON.parse(decodeURIComponent(raw));
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid user cookie' },
      { status: 400 }
    );
  }
}
