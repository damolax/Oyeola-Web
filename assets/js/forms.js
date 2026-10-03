(() => {
  const forms = [...document.querySelectorAll('[data-lead-form]')];
  if (!forms.length) return;

  const fallbackEmail = 'oyeolawebmaster@gmail.com';
  const pageParams = new URLSearchParams(location.search);
  const contextFields = ['demo','result','source','utm_source','utm_medium','utm_campaign'];
  forms.forEach(form => {
    const demo = pageParams.get('demo');
    if (demo) {
      const note = document.createElement('div');
      note.className = 'status success';
      note.textContent = `Demo context attached: ${demo}. You do not need to explain that part again.`;
      form.prepend(note);
    }
  });

  const deliverByFormSubmit = async (data) => {
    const response = await fetch(`https://formsubmit.co/ajax/${fallbackEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        _subject: `Oyeola ${data.type || 'project'} enquiry from ${data.name || data.email}`,
        _template: 'table',
        _captcha: 'false',
        _replyto: data.email || '',
        _url: location.href,
        ...data
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) {
      throw new Error(result.message || 'The email delivery fallback could not send your enquiry.');
    }
    return result;
  };

  const submitLead = async (form) => {
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());
    data.source_page = location.pathname;
    contextFields.forEach(key => {
      const value = pageParams.get(key);
      if (value) data[key] = value;
    });
    if (button) button.disabled = true;
    if (status) { status.textContent = 'Sending…'; status.className = 'form-status'; }

    try {
      let saved = false;

      try {
        const response = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json().catch(() => ({}));
        saved = response.ok && result.ok === true;
      } catch (_) {
        saved = false;
      }

      if (!saved) {
        await deliverByFormSubmit(data);
      }

      if (status) {
        status.textContent = form.dataset.success || 'Thanks — your details were sent.';
        status.className = 'form-status success';
      }
      form.querySelectorAll('[data-unlock]').forEach(el => el.hidden = false);
      form.dispatchEvent(new CustomEvent('oyeola:lead-saved', { bubbles: true, detail: data }));
      if (form.dataset.reset !== 'false') form.reset();
    } catch (error) {
      const subject = encodeURIComponent(`Oyeola project enquiry from ${data.name || data.email || 'website visitor'}`);
      const body = encodeURIComponent([
        `Name: ${data.name || ''}`,
        `Email: ${data.email || ''}`,
        `Service: ${data.service_type || ''}`,
        `URL: ${data.business_url || ''}`,
        `Timeline: ${data.timeline || ''}`,
        '',
        'What is happening now?',
        data.problem || '',
        '',
        'Desired result:',
        data.desired_result || ''
      ].join('\n'));
      if (status) {
        status.innerHTML = `Automatic delivery is unavailable. <a href="mailto:${fallbackEmail}?subject=${subject}&body=${body}">Send this enquiry by email instead</a>.`;
        status.className = 'form-status error';
      }
    } finally {
      if (button) button.disabled = false;
    }
  };

  forms.forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    submitLead(form);
  }));
})();
