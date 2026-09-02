(() => {
  const isWebsite = !!document.getElementById('website-check-form');
  const result = document.getElementById(isWebsite ? 'website-result' : 'operations-result');
  if (!result) return;

  const inject = () => {
    if (result.querySelector('[data-check-lead-form]') || result.classList.contains('hidden')) return;
    const score = result.querySelector('.result-score strong')?.textContent?.trim() || '';
    const label = result.querySelector('.result-score span')?.textContent?.replace(/^\/100\s*·\s*/,'').trim() || '';
    const businessUrl = isWebsite ? document.getElementById('website-url')?.value || '' : '';
    const form = document.createElement('form');
    form.className = 'lead-form download-unlock';
    form.dataset.leadForm = '';
    form.dataset.checkLeadForm = '';
    form.dataset.success = 'Thanks — Oyeola now has your result and contact details.';
    form.dataset.reset = 'false';
    form.innerHTML = `
      <input type="hidden" name="type" value="${isWebsite ? 'website-check' : 'operations-check'}">
      <input type="hidden" name="service_type" value="${isWebsite ? 'Website' : 'Operations system'}">
      <input type="hidden" name="business_url" value="${businessUrl.replace(/"/g,'&quot;')}">
      <input type="hidden" name="score" value="${score}">
      <input type="hidden" name="result_label" value="${label.replace(/"/g,'&quot;')}">
      <div class="honeypot" aria-hidden="true"><label>Company fax<input name="company_fax" tabindex="-1" autocomplete="off"></label></div>
      <div><p class="eyebrow">Want Oyeola to review this result?</p><h3>Send the result with enough context for a useful recommendation.</h3></div>
      <div class="form-grid">
        <div class="field"><label>Name<input name="name" autocomplete="name" required></label></div>
        <div class="field"><label>Email<input name="email" type="email" autocomplete="email" required></label></div>
        <div class="field full"><label>What outcome matters most?<textarea name="desired_result" required></textarea></label></div>
      </div>
      <div class="actions"><button class="btn small" type="submit">Send my result to Oyeola</button><a class="btn small secondary" href="contact.html">Start a project enquiry</a></div>
      <p class="form-status" data-form-status aria-live="polite"></p>`;
    result.appendChild(form);
    if (!document.querySelector('script[src$="forms.js"]')) {
      const script = document.createElement('script');
      script.src = 'assets/js/forms.js';
      document.body.appendChild(script);
    } else {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const status = form.querySelector('[data-form-status]');
        const data = Object.fromEntries(new FormData(form).entries());
        data.source_page = location.pathname;
        status.textContent = 'Sending…';
        try {
          const response = await fetch('/api/lead', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
          const body = await response.json().catch(()=>({}));
          if (!response.ok) throw new Error(body.error || 'Could not submit the result.');
          status.textContent = 'Thanks — Oyeola now has your result and contact details.';
          status.className = 'form-status success';
        } catch (error) {
          status.innerHTML = `${error.message} <a href="mailto:oyeolawebmaster@gmail.com">Email Oyeola instead</a>.`;
          status.className = 'form-status error';
        }
      });
    }
  };

  const observer = new MutationObserver(inject);
  observer.observe(result, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  inject();
})();
