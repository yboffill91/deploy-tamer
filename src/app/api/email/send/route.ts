import { Resend } from 'resend';
import { NextRequest } from 'next/server';
import { EmailsEntity } from '@/core/entities';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EmailsEntity;

    const { from, to, subject, text, html, react } = body;

    if (!from || !to || !subject) {
      return Response.json(
        {
          error:
            'The from, to, and subject fields in the email body are mandatory.',
        },
        { status: 400 }
      );
    }

    if (!text && !html && !react) {
      return Response.json(
        {
          error:
            'You must send either plain text, HTML, or a React component in the body of the email.',
        },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      ...(text && { text }),
      ...(html && { html }),
      ...(react && { react }),
    });

    if (error) {
      return Response.json(error, { status: 500 });
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: `Error sending email: ${error instanceof Error ? error.message : 'Unexpected Error from Mailer Service'}`},
      { status: 500 }
    );
  }
}
