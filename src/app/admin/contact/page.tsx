import { AdminPageHeader, AdminShell } from '@/components/admin/AdminShell';
import { Card, Field, Submit, TextArea } from '@/components/admin/AdminFields';
import { requireAdmin } from '@/lib/auth';
import { getSettings } from '@/lib/site';
import { updateSettingsAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function ContactSettingsPage() {
  requireAdmin();
  const s = await getSettings();
  return <AdminShell><AdminPageHeader title="Contact and email settings" body="Change where lead notifications go and what the user sees after submitting." /><form action={updateSettingsAction} className="grid gap-5"><input type="hidden" name="brandName" value={s.brandName} /><input type="hidden" name="founderName" value={s.founderName} /><input type="hidden" name="tagline" value={s.tagline} /><input type="hidden" name="logoUrl" value={s.logoUrl} /><input type="hidden" name="faviconUrl" value={s.faviconUrl} /><input type="hidden" name="founderPhotoUrl" value={s.founderPhotoUrl} /><input type="hidden" name="primaryColor" value={s.primaryColor} /><input type="hidden" name="secondaryColor" value={s.secondaryColor} /><input type="hidden" name="accentColor" value={s.accentColor} /><input type="hidden" name="backgroundColor" value={s.backgroundColor} /><input type="hidden" name="mutedColor" value={s.mutedColor} /><input type="hidden" name="copperColor" value={s.copperColor} /><input type="hidden" name="textColor" value={s.textColor} /><input type="hidden" name="buttonRadius" value={s.buttonRadius} /><input type="hidden" name="fontFamily" value={s.fontFamily} /><input type="hidden" name="footerText" value={s.footerText} /><input type="hidden" name="seoTitle" value={s.seoTitle} /><input type="hidden" name="seoDescription" value={s.seoDescription} /><input type="hidden" name="ogImage" value={s.ogImage} /><Card><div className="grid gap-4"><Field label="Contact form recipient email" name="contactRecipientEmail" defaultValue={s.contactRecipientEmail} /><Field label="Email subject line format" name="emailSubjectFormat" defaultValue={s.emailSubjectFormat} help="Use {{name}} to insert the lead name." /><TextArea label="Success message" name="successMessage" defaultValue={s.successMessage} /><TextArea label="Thank-you page message" name="thankYouMessage" defaultValue={s.thankYouMessage} /><TextArea label="Auto-reply message" name="autoReplyMessage" defaultValue={s.autoReplyMessage} /></div></Card><Submit /></form></AdminShell>;
}
