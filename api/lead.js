const allowedTypes = new Set(['contact','website-check','operations-check','planner-download','start-here']);
const fallbackEmail = 'oyeolawebmaster@gmail.com';

function clean(value, max = 2000) {
  return String(value ?? '').trim().slice(0, max);
}

async function deliverByEmail(payload) {
  const response = await fetch(`https://formsubmit.co/ajax/${fallbackEmail}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      _subject: `Oyeola ${payload.type} enquiry from ${payload.name || payload.email}`,
      _template: 'table',
      _captcha: 'false',
      name: payload.name,
      email: payload.email,
      service_type: payload.service_type,
      business_url: payload.business_url,
      problem: payload.problem,
      desired_result: payload.desired_result,
      timeline: payload.timeline,
      source_page: payload.source_page,
      score: payload.score ?? '',
      result_label: payload.result_label,
      details: JSON.stringify(payload.details || {}),
      submitted_at: payload.created_at
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`FormSubmit fallback failed: ${response.status} ${message}`);
  }

  const result = await response.json().catch(() => ({}));
  if (result.success === false) {
    throw new Error(result.message || 'FormSubmit fallback did not accept the enquiry.');
  }
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
  let capture = '';

  if (supabaseKey) {
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

      if (insert.ok) {
        capture = 'database';
      } else {
        const message = await insert.text();
        console.error('Supabase lead insert failed', insert.status, message);
      }
    } catch (error) {
      console.error('Supabase lead insert error', error);
    }
  }

  if (!capture) {
    try {
      await deliverByEmail(payload);
      capture = 'email';
    } catch (error) {
      console.error(error);
      return res.status(502).json({ error: 'Your enquiry could not be delivered automatically. Please email Oyeola directly.' });
    }
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

  return res.status(200).json({ ok: true, capture });
}
