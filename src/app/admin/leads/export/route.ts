import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

function csvCell(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export async function GET() {
  requireAdmin();
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  const headers = ['Name', 'Email', 'Website URL', 'Platform', 'Wants Reviewed', 'Main Challenge', 'Monthly Traffic', 'Status', 'Internal Notes', 'Created At'];
  const rows = leads.map((lead) => [lead.name, lead.email, lead.websiteUrl, lead.platform, lead.wantsReviewed, lead.mainChallenge, lead.monthlyTraffic, lead.status, lead.internalNotes, lead.createdAt.toISOString()].map(csvCell).join(','));
  const csv = [headers.map(csvCell).join(','), ...rows].join('\n');
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="oyeola-leads.csv"' } });
}
