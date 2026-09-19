/**
 * Single source of truth for everything the client edits by hand: brand
 * strings, contacts, and section feature flags.
 *
 * Every value the client will replace later is a placeholder marked
 * `// TODO(client)`. Analytics IDs and secrets live in `.env` / Worker
 * secrets, not here. UI copy lives in `src/i18n/ui.ts`.
 */

export interface SiteContacts {
  /** Machine-readable phone in E.164 for `tel:` links, e.g. `+380XXXXXXXXX`. */
  phone: string;
  /** Human-formatted phone shown in the UI. */
  phoneDisplay: string;
  email: string;
  /** Telegram username without the leading `@`. */
  telegram: string;
  /** WhatsApp number in international digits (no `+`), for `wa.me/...`. */
  whatsapp: string;
  /** Working hours line, e.g. `Пн–Пт, 9:00–18:00`. */
  hours: string;
}

export interface SiteFeatures {
  /** Military practice is the hero focus. Toggling changes hero copy + order. */
  militaryFocus: boolean;
  /** Show the real lawyer photo instead of the monogram placeholder. */
  showPhoto: boolean;
  /** Reveal the "Виграні справи" section (no content at launch). */
  showCases: boolean;
  /** Reveal the "Відгуки" section (no content at launch). */
  showReviews: boolean;
  /** Show the trust-numbers strip in the hero. */
  showStats: boolean;
}

export interface Site {
  name: string;
  legalName: string;
  lawyerName: string;
  city: string;
  contacts: SiteContacts;
  features: SiteFeatures;
  /** Extra social links (Instagram, Facebook, …). Empty until the client sends them. */
  social: Record<string, string>;
}

export const site: Site = {
  name: 'NM&P',
  legalName: 'Адвокатське бюро Nataliia Mykhalchuk & Partners',
  lawyerName: 'Михальчук Наталія',
  city: 'Київ',

  contacts: {
    // TODO(client): real phone in +380 format.
    phone: '+380000000000',
    // TODO(client): same number, formatted for display.
    phoneDisplay: '+380 00 000 00 00',
    // TODO(client): real inbox address.
    email: 'hello@example.com',
    // TODO(client): Telegram username (without @).
    telegram: 'nmp_law',
    // TODO(client): WhatsApp number, international digits without +.
    whatsapp: '380000000000',
    // TODO(client): real working hours.
    hours: 'Пн–Пт, 9:00–18:00',
  },

  features: {
    militaryFocus: true,
    showPhoto: false,
    showCases: false,
    showReviews: false,
    showStats: true,
  },

  // TODO(client): social profile links, e.g. { instagram: 'https://...' }.
  social: {},
};
