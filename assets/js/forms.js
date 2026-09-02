(() => {
  const forms = [...document.querySelectorAll('[data-lead-form]')];
  if (!forms.length) return;

  const submitLead = async (form) => {
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());
    data.source_page = location.pathname;
    if (button) button.disabled = true;
    if (status) { status.textContent = 'Sending…'; status.className = 'form-status'; }

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not submit the form.');

      if (status) { status.textContent = form.dataset.success || 'Thanks — your details were sent.'; status.className = 'form-status success'; }
      form.querySelectorAll('[data-unlock]').forEach(el => el.hidden = false);
      form.dispatchEvent(new CustomEvent('oyeola:lead-saved', { bubbles: true, detail: data }));
      if (form.dataset.reset !== 'false') form.reset();
    } catch (error) {
      if (status) {
        status.innerHTML = `${error.message} <a href="mailto:oyeolawebmaster@gmail.com">Email Oyeola instead</a>.`;
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
