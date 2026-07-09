// Official LOCK channels — the single source of truth for social + contact
// links. Used by the footer, the JSON-LD `sameAs` (SEO/GEO/AEO — search engines
// and AI answer-engines use sameAs to tie the brand to its verified profiles),
// and the contact page. Update here, everywhere follows.

// WhatsApp business line = the Bit payment number 054-4555060 in E.164 form.
export const WHATSAPP_E164 = '+972544555060'
export const WHATSAPP_DISPLAY = '+972 54-455-5060'
// wa.me wants digits only, no '+' and no leading 0.
export const WHATSAPP_URL = 'https://wa.me/972544555060'

export const SOCIAL = [
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/lock.show.growth.intelligence/' },
  { key: 'facebook',  label: 'Facebook',  href: 'https://www.facebook.com/lock.show.growth.intelligence/' },
  { key: 'linkedin',  label: 'LinkedIn',  href: 'https://www.linkedin.com/company/lock.show/' },
] as const

// `sameAs` for structured data: the social profiles + the WhatsApp deep-link.
export const SAME_AS = [...SOCIAL.map((s) => s.href), WHATSAPP_URL]
