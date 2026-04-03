/** Email & phones — tel / WhatsApp use E.164 without leading + in wa.me paths */
export const CONTACT_EMAIL = 'immotionbyte@gmail.com'

export type ContactPhone = {
  display: string
  /** tel: href, e.g. +919867024294 */
  telHref: string
  /** wa.me path digits only (country code + number) */
  whatsappDigits: string
}

export const CONTACT_PHONES: ContactPhone[] = [
  { display: '9867024294', telHref: '+919867024294', whatsappDigits: '919867024294' },
]

export function mailtoHref(): string {
  return `mailto:${CONTACT_EMAIL}`
}

export function whatsappHref(digits: string): string {
  return `https://wa.me/${digits}`
}
