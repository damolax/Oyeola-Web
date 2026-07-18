import nodemailer from 'nodemailer';

export async function sendLeadNotification(options: { to: string; subject: string; text: string; replyTo?: string }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Oyeola <hello@oyeola.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    replyTo: options.replyTo
  });
  return { skipped: false };
}
