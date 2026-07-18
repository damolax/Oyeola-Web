import { prisma } from './db';
import { parseJson } from './json';

export async function getSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'settings' } });
  if (settings) return settings;
  return prisma.siteSettings.create({ data: { id: 'settings' } });
}

export async function getNavigation() {
  const dbNav = await prisma.navigationItem.findMany({ where: { visible: true }, orderBy: { order: 'asc' } });
  if (dbNav.length) return dbNav.map((item) => ({ label: item.label, href: item.href }));
  const settings = await getSettings();
  return parseJson<{ label: string; href: string }[]>(settings.navigationJson, []);
}

export async function getHomeSections() {
  return prisma.section.findMany({ where: { pageSlug: 'home', visible: true }, orderBy: { order: 'asc' } });
}
