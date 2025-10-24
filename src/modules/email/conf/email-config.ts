export const emailConfig = {
  smtp: {
    host: process.env.NEXT_PUBLIC_SMTP_HOST!,
    port: Number(process.env.NEXT_PUBLIC_SMTP_PORT || 465),
    user: process.env.NEXT_PUBLIC_SMTP_USER!,
    pass: process.env.NEXT_PUBLIC_SMTP_PASS!,
    from: process.env.NEXT_PUBLIC_EMAIL_FROM!,
  },
};
