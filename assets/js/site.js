const OYEOLA_EMAIL = "oyeolawebmaster@gmail.com";

function encodeMail(text){ return encodeURIComponent(text).replace(/%20/g, '+'); }

function buildMailto({service='Website Growth System', packageName='Custom Offer'} = {}){
  const subject = `${service} enquiry`;
  const body = `Hi Oyeola Studio,

I am interested in: ${service}
Package/option: ${packageName}

My website/business link is:
[add link]

The main problem I want to fix is:
[explain the problem]

What I would like to improve first is:
[website clarity / ecommerce sales / follow-up / Airtable system / analytics / SEO-AEO / process]

My timeline is:
[add timeline]

Please let me know the best next step.

Thank you.`;
  return `mailto:${OYEOLA_EMAIL}?subject=${encodeMail(subject)}&body=${encodeMail(body)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if(menuBtn && navLinks){
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
  document.querySelectorAll('[data-mail-service]').forEach(el => {
    const service = el.getAttribute('data-mail-service');
    const packageName = el.getAttribute('data-mail-package') || 'Custom Offer';
    el.setAttribute('href', buildMailto({service, packageName}));
  });
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const filters = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('[data-category]');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        item.style.display = filter === 'all' || item.getAttribute('data-category') === filter ? '' : 'none';
      });
    });
  });

  const serviceSelect = document.querySelector('#contact-service');
  const packageSelect = document.querySelector('#contact-package');
  const messageBox = document.querySelector('#contact-message-preview');
  const emailButton = document.querySelector('#contact-email-button');
  const updateContact = () => {
    if(!serviceSelect || !packageSelect || !messageBox || !emailButton) return;
    const href = buildMailto({service: serviceSelect.value, packageName: packageSelect.value});
    emailButton.setAttribute('href', href);
    const decoded = decodeURIComponent(href.split('body=')[1].replace(/\+/g, ' '));
    messageBox.textContent = decoded;
  };
  if(serviceSelect && packageSelect){
    serviceSelect.addEventListener('change', updateContact);
    packageSelect.addEventListener('change', updateContact);
    updateContact();
  }
  const copyBtn = document.querySelector('#copy-message');
  if(copyBtn && messageBox){
    copyBtn.addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText(messageBox.textContent); copyBtn.textContent = 'Copied'; setTimeout(()=>copyBtn.textContent='Copy Message',1400); }
      catch(e){ copyBtn.textContent = 'Copy failed'; }
    });
  }
});
