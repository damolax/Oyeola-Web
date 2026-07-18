export function ContactForm() {
  return (
    <form action="/api/leads" method="post" className="grid gap-5 rounded-[32px] border border-ink/10 bg-white/95 p-6 text-ink shadow-soft md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="form-field"><label htmlFor="name">Your name</label><input id="name" name="name" required /></div>
        <div className="form-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" required /></div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="form-field"><label htmlFor="websiteUrl">Current website or business link</label><input id="websiteUrl" name="websiteUrl" type="url" placeholder="https://yourwebsite.com" required /></div>
        <div className="form-field"><label htmlFor="platform">Platform</label><select id="platform" name="platform" required><option value="">Select platform</option><option>Shopify</option><option>WordPress</option><option>Wix</option><option>Webflow</option><option>Squarespace</option><option>No website yet</option><option>Other / not sure</option></select></div>
      </div>
      <div className="form-field"><label htmlFor="wantsReviewed">What do you need first?</label><select id="wantsReviewed" name="wantsReviewed" required><option value="">Choose the closest fit</option><option>New website</option><option>Website redesign</option><option>Ecommerce store review</option><option>Booking or payment setup</option><option>Email/contact automation</option><option>Not sure yet</option></select></div>
      <div className="form-field"><label htmlFor="mainChallenge">What should the website help you solve?</label><textarea id="mainChallenge" name="mainChallenge" required placeholder="Example: people do not understand what I offer, I need a better contact flow, I want bookings/payments, or my store visitors are not buying..." /></div>
      <div className="form-field"><label htmlFor="monthlyTraffic">Optional: traffic, budget, or timeline</label><input id="monthlyTraffic" name="monthlyTraffic" placeholder="Example: launch in 2 weeks, small budget, 1k visits/month..." /></div>
      <input type="text" name="companyName" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-start gap-3 text-sm leading-6 text-slateText"><input type="checkbox" name="consent" value="yes" required className="mt-1" /> I agree that Oyeola can use these details to review my request and contact me about the next step.</label>
      <button type="submit" className="rounded-button bg-ink px-6 py-4 text-sm font-black text-paper transition hover:-translate-y-0.5">Send My Request</button>
      <p className="text-sm leading-6 text-slateText">No pressure. Your request is saved in the private admin leads inbox. Email notification is optional.</p>
    </form>
  );
}
