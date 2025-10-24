import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
      secure: Number(process.env.NEXT_PUBLIC_SMTP_PORT) === 465,
      auth: {
        user: process.env.NEXT_PUBLICSMTP_USER,
        pass: process.env.NEXT_PUBLIC_SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_EMAIL_FROM,
      to,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
