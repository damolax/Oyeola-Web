const allowedTypes = new Set(['contact','website-check','operations-check','planner-download','start-here']);

function clean(value, max = 2000) {
  return String(value ?? '').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  if (clean(body.company_fax, 100)) return res.status(200).json({ ok: true });

  const type = clean(body.type, 50);
  const email = clean(body.email, 320).toLowerCase();
  if (!allowedTypes.has(type) || !email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email and enquiry type.' });
  }

  const payload = {
    type,
    name: clean(body.name, 160),
    email,
    service_type: clean(body.service_type, 120),
    business_url: clean(body.business_url, 1000),
    problem: clean(body.problem, 4000),
    desired_result: clean(body.desired_result, 4000),
    timeline: clean(body.timeline, 200),
    source_page: clean(body.source_page, 500),
    score: Number.isFinite(Number(body.score)) ? Number(body.score) : null,
    result_label: clean(body.result_label, 120),
    details: body.details && typeof body.details === 'object' ? body.details : {},
    created_at: new Date().toISOString()
  };

  const supabaseUrl = process.env.SUPABASE_URL || 'https://pnuyufllwzultgrgpotz.supabase.co';
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseKey) {
    return res.status(503).json({ error: 'Lead capture is being connected. Please use the email fallback for now.' });
  }

  try {
    const insert = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!insert.ok) {
      const message = await insert.text();
      console.error('Supabase lead insert failed', insert.status, message);
      return res.status(502).json({ error: 'Your enquiry could not be saved yet. Please use the email fallback.' });
    }

    if (process.env.RESEND_API_KEY && process.env.OYEOLA_FROM_EMAIL) {
      const resources = type === 'planner-download'
        ? '<p>Your planner sample is unlocked on the page you submitted. You can return to that page to access the resources.</p>'
        : '<p>Your enquiry has been received. Oyeola can now review the context you submitted before replying.</p>';
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: process.env.OYEOLA_FROM_EMAIL,
          to: [email],
          subject: type === 'planner-download' ? 'Your Oyeola planner sample' : 'Oyeola received your enquiry',
          html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>Thanks${payload.name ? `, ${payload.name}` : ''}.</h2>${resources}<p>If you need to add context, reply to this email.</p></div>`
        })
      }).catch(err => console.error('Resend delivery failed', err));
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong while saving your enquiry.' });
  }
}
