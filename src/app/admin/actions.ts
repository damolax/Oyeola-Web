'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { arrayFromTextarea, slugify } from '@/lib/json';
import { clearAdminSession, expectedAdminPassword, requireAdmin, setAdminSession } from '@/lib/auth';

function bool(value: FormDataEntryValue | null) {
  return value === 'on' || value === 'true' || value === 'yes';
}

function stringValue(formData: FormData, key: string, fallback = '') {
  return String(formData.get(key) || fallback).trim();
}

export async function loginAction(formData: FormData) {
  const password = stringValue(formData, 'password');
  if (password !== expectedAdminPassword()) {
    redirect('/admin/login?error=1');
  }
  setAdminSession();
  redirect('/admin');
}

export async function logoutAction() {
  clearAdminSession();
  redirect('/admin/login');
}

export async function updateSettingsAction(formData: FormData) {
  requireAdmin();
  const socialLinks = [
    { label: 'LinkedIn', href: stringValue(formData, 'linkedin') },
    { label: 'Email', href: `mailto:${stringValue(formData, 'contactRecipientEmail')}` }
  ].filter((item) => item.href && item.href !== 'mailto:');

  await prisma.siteSettings.upsert({
    where: { id: 'settings' },
    create: {
      id: 'settings',
      brandName: stringValue(formData, 'brandName', 'Oyeola'),
      founderName: stringValue(formData, 'founderName', 'Olalekan Musodiq Oyekunle'),
      tagline: stringValue(formData, 'tagline'),
      logoUrl: stringValue(formData, 'logoUrl'),
      faviconUrl: stringValue(formData, 'faviconUrl'),
      founderPhotoUrl: stringValue(formData, 'founderPhotoUrl'),
      primaryColor: stringValue(formData, 'primaryColor', '#0D1117'),
      secondaryColor: stringValue(formData, 'secondaryColor', '#161B22'),
      accentColor: stringValue(formData, 'accentColor', '#38D996'),
      backgroundColor: stringValue(formData, 'backgroundColor', '#F8F5EF'),
      mutedColor: stringValue(formData, 'mutedColor', '#E8DDC7'),
      copperColor: stringValue(formData, 'copperColor', '#C98A4A'),
      textColor: stringValue(formData, 'textColor', '#68707D'),
      buttonRadius: stringValue(formData, 'buttonRadius', '999px'),
      fontFamily: stringValue(formData, 'fontFamily', 'Inter'),
      footerText: stringValue(formData, 'footerText'),
      socialLinksJson: JSON.stringify(socialLinks),
      seoTitle: stringValue(formData, 'seoTitle'),
      seoDescription: stringValue(formData, 'seoDescription'),
      ogImage: stringValue(formData, 'ogImage'),
      contactRecipientEmail: stringValue(formData, 'contactRecipientEmail'),
      emailSubjectFormat: stringValue(formData, 'emailSubjectFormat'),
      successMessage: stringValue(formData, 'successMessage'),
      thankYouMessage: stringValue(formData, 'thankYouMessage'),
      autoReplyMessage: stringValue(formData, 'autoReplyMessage')
    },
    update: {
      brandName: stringValue(formData, 'brandName', 'Oyeola'),
      founderName: stringValue(formData, 'founderName', 'Olalekan Musodiq Oyekunle'),
      tagline: stringValue(formData, 'tagline'),
      logoUrl: stringValue(formData, 'logoUrl'),
      faviconUrl: stringValue(formData, 'faviconUrl'),
      founderPhotoUrl: stringValue(formData, 'founderPhotoUrl'),
      primaryColor: stringValue(formData, 'primaryColor', '#0D1117'),
      secondaryColor: stringValue(formData, 'secondaryColor', '#161B22'),
      accentColor: stringValue(formData, 'accentColor', '#38D996'),
      backgroundColor: stringValue(formData, 'backgroundColor', '#F8F5EF'),
      mutedColor: stringValue(formData, 'mutedColor', '#E8DDC7'),
      copperColor: stringValue(formData, 'copperColor', '#C98A4A'),
      textColor: stringValue(formData, 'textColor', '#68707D'),
      buttonRadius: stringValue(formData, 'buttonRadius', '999px'),
      fontFamily: stringValue(formData, 'fontFamily', 'Inter'),
      footerText: stringValue(formData, 'footerText'),
      socialLinksJson: JSON.stringify(socialLinks),
      seoTitle: stringValue(formData, 'seoTitle'),
      seoDescription: stringValue(formData, 'seoDescription'),
      ogImage: stringValue(formData, 'ogImage'),
      contactRecipientEmail: stringValue(formData, 'contactRecipientEmail'),
      emailSubjectFormat: stringValue(formData, 'emailSubjectFormat'),
      successMessage: stringValue(formData, 'successMessage'),
      thankYouMessage: stringValue(formData, 'thankYouMessage'),
      autoReplyMessage: stringValue(formData, 'autoReplyMessage')
    }
  });
  revalidatePath('/', 'layout');
}

export async function updateSectionAction(formData: FormData) {
  requireAdmin();
  const id = stringValue(formData, 'id');
  const rawJson = stringValue(formData, 'rawJson');
  let existing: Record<string, unknown> = {};
  if (rawJson) {
    try { existing = JSON.parse(rawJson) as Record<string, unknown>; } catch { throw new Error('Invalid JSON in advanced content field.'); }
  }

  const updates: Record<string, unknown> = { ...existing };
  for (const key of ['eyebrow', 'subheadline', 'body', 'primaryCtaLabel', 'primaryCtaLink', 'secondaryCtaLabel', 'secondaryCtaLink', 'ctaLabel', 'ctaLink']) {
    const value = stringValue(formData, key);
    if (value || key in updates) updates[key] = value;
  }
  const bullets = arrayFromTextarea(formData.get('bullets'));
  const cards = arrayFromTextarea(formData.get('cards'));
  if (bullets.length || 'bullets' in updates) updates.bullets = bullets;
  if (cards.length || 'cards' in updates) updates.cards = cards;

  await prisma.section.update({
    where: { id },
    data: {
      title: stringValue(formData, 'title'),
      visible: bool(formData.get('visible')),
      order: Number(formData.get('order') || 0),
      contentJson: JSON.stringify(updates, null, 2)
    }
  });
  revalidatePath('/');
  revalidatePath('/admin/homepage');
}

export async function createServiceAction(formData: FormData) {
  requireAdmin();
  const title = stringValue(formData, 'title');
  const slug = slugify(stringValue(formData, 'slug') || title);
  await prisma.service.create({
    data: {
      title,
      slug,
      summary: stringValue(formData, 'summary'),
      problem: stringValue(formData, 'problem'),
      whatWeDo: stringValue(formData, 'whatWeDo'),
      deliverable: stringValue(formData, 'deliverable'),
      bestFit: stringValue(formData, 'bestFit'),
      icon: stringValue(formData, 'icon', 'ShoppingBag'),
      order: Number(formData.get('order') || 0),
      includedJson: JSON.stringify(arrayFromTextarea(formData.get('included')), null, 2),
      processJson: JSON.stringify(arrayFromTextarea(formData.get('process')), null, 2),
      faqsJson: JSON.stringify([], null, 2),
      published: bool(formData.get('published')),
      seoTitle: stringValue(formData, 'seoTitle'),
      seoDescription: stringValue(formData, 'seoDescription')
    }
  });
  revalidatePath('/services');
  redirect('/admin/services');
}

export async function updateServiceAction(formData: FormData) {
  requireAdmin();
  const id = stringValue(formData, 'id');
  const title = stringValue(formData, 'title');
  await prisma.service.update({
    where: { id },
    data: {
      title,
      slug: slugify(stringValue(formData, 'slug') || title),
      summary: stringValue(formData, 'summary'),
      problem: stringValue(formData, 'problem'),
      whatWeDo: stringValue(formData, 'whatWeDo'),
      deliverable: stringValue(formData, 'deliverable'),
      bestFit: stringValue(formData, 'bestFit'),
      icon: stringValue(formData, 'icon', 'ShoppingBag'),
      imageUrl: stringValue(formData, 'imageUrl'),
      order: Number(formData.get('order') || 0),
      includedJson: JSON.stringify(arrayFromTextarea(formData.get('included')), null, 2),
      processJson: JSON.stringify(arrayFromTextarea(formData.get('process')), null, 2),
      ctaLabel: stringValue(formData, 'ctaLabel', 'Request a Store Review'),
      ctaLink: stringValue(formData, 'ctaLink', '/contact'),
      published: bool(formData.get('published')),
      seoTitle: stringValue(formData, 'seoTitle'),
      seoDescription: stringValue(formData, 'seoDescription')
    }
  });
  revalidatePath('/services', 'layout');
  revalidatePath('/admin/services');
}

export async function deleteServiceAction(formData: FormData) {
  requireAdmin();
  await prisma.service.delete({ where: { id: stringValue(formData, 'id') } });
  revalidatePath('/services', 'layout');
  redirect('/admin/services');
}

export async function createCategoryAction(formData: FormData) {
  requireAdmin();
  const name = stringValue(formData, 'name');
  await prisma.portfolioCategory.create({ data: { name, slug: slugify(stringValue(formData, 'slug') || name), description: stringValue(formData, 'description'), order: Number(formData.get('order') || 0) } });
  revalidatePath('/portfolio');
  redirect('/admin/portfolio');
}

export async function createPortfolioAction(formData: FormData) {
  requireAdmin();
  const title = stringValue(formData, 'title');
  const selectedCategories = formData.getAll('categories').map(String);
  await prisma.portfolioItem.create({
    data: {
      title,
      slug: slugify(stringValue(formData, 'slug') || title),
      clientType: stringValue(formData, 'clientType'),
      niche: stringValue(formData, 'niche'),
      problem: stringValue(formData, 'problem'),
      reviewed: stringValue(formData, 'reviewed'),
      findingsJson: JSON.stringify(arrayFromTextarea(formData.get('findings')), null, 2),
      fixesJson: JSON.stringify(arrayFromTextarea(formData.get('fixes')), null, 2),
      impact: stringValue(formData, 'impact'),
      toolsJson: JSON.stringify(arrayFromTextarea(formData.get('tools')), null, 2),
      sampleLabel: stringValue(formData, 'sampleLabel', 'Sample Breakdown'),
      featured: bool(formData.get('featured')),
      showOnHome: bool(formData.get('showOnHome')),
      published: bool(formData.get('published')),
      categories: { connect: selectedCategories.map((id) => ({ id })) }
    }
  });
  revalidatePath('/portfolio', 'layout');
  redirect('/admin/portfolio');
}

export async function updatePortfolioStatusAction(formData: FormData) {
  requireAdmin();
  await prisma.portfolioItem.update({ where: { id: stringValue(formData, 'id') }, data: { featured: bool(formData.get('featured')), showOnHome: bool(formData.get('showOnHome')), published: bool(formData.get('published')) } });
  revalidatePath('/portfolio', 'layout');
  revalidatePath('/');
}

export async function deletePortfolioAction(formData: FormData) {
  requireAdmin();
  await prisma.portfolioItem.delete({ where: { id: stringValue(formData, 'id') } });
  revalidatePath('/portfolio', 'layout');
  redirect('/admin/portfolio');
}

export async function createTestimonialAction(formData: FormData) {
  requireAdmin();
  await prisma.testimonial.create({ data: { clientName: stringValue(formData, 'clientName'), company: stringValue(formData, 'company'), role: stringValue(formData, 'role'), quote: stringValue(formData, 'quote'), tag: stringValue(formData, 'tag'), rating: formData.get('rating') ? Number(formData.get('rating')) : null, featured: bool(formData.get('featured')), showOnHome: bool(formData.get('showOnHome')), visible: bool(formData.get('visible')), order: Number(formData.get('order') || 0) } });
  revalidatePath('/', 'layout');
  redirect('/admin/testimonials');
}

export async function updateTestimonialAction(formData: FormData) {
  requireAdmin();
  await prisma.testimonial.update({ where: { id: stringValue(formData, 'id') }, data: { clientName: stringValue(formData, 'clientName'), company: stringValue(formData, 'company'), role: stringValue(formData, 'role'), quote: stringValue(formData, 'quote'), tag: stringValue(formData, 'tag'), rating: formData.get('rating') ? Number(formData.get('rating')) : null, featured: bool(formData.get('featured')), showOnHome: bool(formData.get('showOnHome')), visible: bool(formData.get('visible')), order: Number(formData.get('order') || 0) } });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/testimonials');
}

export async function deleteTestimonialAction(formData: FormData) {
  requireAdmin();
  await prisma.testimonial.delete({ where: { id: stringValue(formData, 'id') } });
  revalidatePath('/', 'layout');
  redirect('/admin/testimonials');
}

export async function createPostAction(formData: FormData) {
  requireAdmin();
  const title = stringValue(formData, 'title');
  await prisma.resourcePost.create({ data: { title, slug: slugify(stringValue(formData, 'slug') || title), category: stringValue(formData, 'category'), featuredImage: stringValue(formData, 'featuredImage'), excerpt: stringValue(formData, 'excerpt'), body: stringValue(formData, 'body'), seoTitle: stringValue(formData, 'seoTitle'), seoDescription: stringValue(formData, 'seoDescription'), published: bool(formData.get('published')) } });
  revalidatePath('/resources', 'layout');
  redirect('/admin/resources');
}

export async function updatePostAction(formData: FormData) {
  requireAdmin();
  const title = stringValue(formData, 'title');
  await prisma.resourcePost.update({ where: { id: stringValue(formData, 'id') }, data: { title, slug: slugify(stringValue(formData, 'slug') || title), category: stringValue(formData, 'category'), featuredImage: stringValue(formData, 'featuredImage'), excerpt: stringValue(formData, 'excerpt'), body: stringValue(formData, 'body'), seoTitle: stringValue(formData, 'seoTitle'), seoDescription: stringValue(formData, 'seoDescription'), published: bool(formData.get('published')) } });
  revalidatePath('/resources', 'layout');
  revalidatePath('/admin/resources');
}

export async function deletePostAction(formData: FormData) {
  requireAdmin();
  await prisma.resourcePost.delete({ where: { id: stringValue(formData, 'id') } });
  revalidatePath('/resources', 'layout');
  redirect('/admin/resources');
}

export async function updateLeadAction(formData: FormData) {
  requireAdmin();
  await prisma.lead.update({ where: { id: stringValue(formData, 'id') }, data: { status: stringValue(formData, 'status', 'new'), internalNotes: stringValue(formData, 'internalNotes') } });
  revalidatePath('/admin/leads');
}

export async function deleteLeadAction(formData: FormData) {
  requireAdmin();
  await prisma.lead.delete({ where: { id: stringValue(formData, 'id') } });
  redirect('/admin/leads');
}

export async function updateLegalPageAction(formData: FormData) {
  requireAdmin();
  await prisma.page.update({ where: { slug: stringValue(formData, 'slug') }, data: { title: stringValue(formData, 'title'), body: stringValue(formData, 'body'), seoTitle: stringValue(formData, 'seoTitle'), seoDescription: stringValue(formData, 'seoDescription'), published: bool(formData.get('published')) } });
  revalidatePath('/privacy');
  revalidatePath('/terms');
  revalidatePath('/admin/pages');
}
