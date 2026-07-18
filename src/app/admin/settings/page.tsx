import { AdminPageHeader, AdminShell } from '@/components/admin/AdminShell';
import { Card, Field, Submit, TextArea } from '@/components/admin/AdminFields';
import { requireAdmin } from '@/lib/auth';
import { getSettings } from '@/lib/site';
import { parseJson } from '@/lib/json';
import { updateSettingsAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  requireAdmin();
  const s = await getSettings();
  const socials = parseJson<{label:string;href:string}[]>(s.socialLinksJson, []);
  const linkedIn = socials.find((item) => item.label.toLowerCase() === 'linkedin')?.href || '';
  return <AdminShell><AdminPageHeader title="Brand settings" body="Edit logo, colors, founder details, SEO defaults, footer copy, social links, and global contact/email settings." />
    <form action={updateSettingsAction} className="grid gap-6">
      <Card><h2 className="mb-5 text-xl font-black">Brand</h2><div className="grid gap-4 md:grid-cols-2"><Field label="Brand name" name="brandName" defaultValue={s.brandName} /><Field label="Founder name" name="founderName" defaultValue={s.founderName} /><Field label="Short tagline" name="tagline" defaultValue={s.tagline} /><Field label="Font family" name="fontFamily" defaultValue={s.fontFamily} /><Field label="Logo URL" name="logoUrl" defaultValue={s.logoUrl} /><Field label="Favicon URL" name="faviconUrl" defaultValue={s.faviconUrl} /><Field label="Founder photo URL" name="founderPhotoUrl" defaultValue={s.founderPhotoUrl} /><Field label="LinkedIn URL" name="linkedin" defaultValue={linkedIn} /></div><div className="mt-4"><TextArea label="Footer text" name="footerText" defaultValue={s.footerText} /></div></Card>
      <Card><h2 className="mb-5 text-xl font-black">Colors and style</h2><div className="grid gap-4 md:grid-cols-4"><Field label="Primary ink" name="primaryColor" defaultValue={s.primaryColor} type="color" /><Field label="Secondary charcoal" name="secondaryColor" defaultValue={s.secondaryColor} type="color" /><Field label="Accent green" name="accentColor" defaultValue={s.accentColor} type="color" /><Field label="Background" name="backgroundColor" defaultValue={s.backgroundColor} type="color" /><Field label="Muted sand" name="mutedColor" defaultValue={s.mutedColor} type="color" /><Field label="Copper" name="copperColor" defaultValue={s.copperColor} type="color" /><Field label="Text color" name="textColor" defaultValue={s.textColor} type="color" /><Field label="Button radius" name="buttonRadius" defaultValue={s.buttonRadius} /></div></Card>
      <Card><h2 className="mb-5 text-xl font-black">SEO</h2><div className="grid gap-4"><Field label="Default SEO title" name="seoTitle" defaultValue={s.seoTitle} /><TextArea label="Default SEO description" name="seoDescription" defaultValue={s.seoDescription} rows={3} /><Field label="Open Graph image URL" name="ogImage" defaultValue={s.ogImage} /></div></Card>
      <Card><h2 className="mb-5 text-xl font-black">Contact and email</h2><div className="grid gap-4 md:grid-cols-2"><Field label="Contact recipient email" name="contactRecipientEmail" defaultValue={s.contactRecipientEmail} /><Field label="Email subject format" name="emailSubjectFormat" defaultValue={s.emailSubjectFormat} /></div><div className="mt-4 grid gap-4"><TextArea label="Success message" name="successMessage" defaultValue={s.successMessage} /><TextArea label="Thank-you page message" name="thankYouMessage" defaultValue={s.thankYouMessage} /><TextArea label="Auto-reply message" name="autoReplyMessage" defaultValue={s.autoReplyMessage} /></div></Card>
      <Submit />
    </form>
  </AdminShell>;
}
