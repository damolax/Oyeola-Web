import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { isRateLimited } from '@/lib/rate-limit';
import { sendLeadNotification } from '@/lib/email';

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  websiteUrl: z.string().url().max(300),
  platform: z.string().min(2).max(80),
  wantsReviewed: z.string().min(2).max(160),
  mainChallenge: z.string().min(10).max(2500),
  monthlyTraffic: z.string().max(100).optional().default(''),
  consent: z.string().optional(),
  companyName: z.string().optional().default('')
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || 'unknown';
  if (isRateLimited(ip, 4, 60_000)) return NextResponse.json({ error: 'Too many submissions. Please try again shortly.' }, { status: 429 });
  const form = await req.formData();
  const raw = Object.fromEntries(form.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: 'Please check the form and try again.' }, { status: 400 });
  if (parsed.data.companyName) return NextResponse.redirect(new URL('/thank-you', req.url), { status: 303 });

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'settings' } });
  const lead = await prisma.lead.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      websiteUrl: parsed.data.websiteUrl,
      platform: parsed.data.platform,
      wantsReviewed: parsed.data.wantsReviewed,
      mainChallenge: parsed.data.mainChallenge,
      monthlyTraffic: parsed.data.monthlyTraffic || '',
      consent: parsed.data.consent === 'yes',
      ipHash: crypto.createHash('sha256').update(ip).digest('hex')
    }
  });

  const subject = (settings?.emailSubjectFormat || 'New Oyeola store review request from {{name}}').replace('{{name}}', lead.name);
  const text = [
    `New Oyeola store review request`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Store URL: ${lead.websiteUrl}`,
    `Platform: ${lead.platform}`,
    `Wants reviewed: ${lead.wantsReviewed}`,
    `Monthly traffic: ${lead.monthlyTraffic || 'Not provided'}`,
    `Main challenge: ${lead.mainChallenge}`
  ].join('\n\n');

  await sendLeadNotification({
    to: settings?.contactRecipientEmail || 'hello@oyeola.com',
    subject,
    text,
    replyTo: lead.email
  });

  return NextResponse.redirect(new URL('/thank-you', req.url), { status: 303 });
}
