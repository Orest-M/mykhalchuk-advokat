/**
 * Helpers that turn config values into ready-to-use link hrefs. Each helper
 * defaults to the value from `src/config/site.ts`, so components can call
 * `telHref()` with no arguments, or pass an explicit value when needed.
 */
import { site } from '../config/site';

/** `tel:` link. Keeps the `+`, strips spaces and separators. */
export function telHref(phone: string = site.contacts.phone): string {
  const normalized = phone.trim().replace(/[^\d+]/g, '');
  return `tel:${normalized}`;
}

/** Telegram deep link. Accepts a username with or without a leading `@`. */
export function telegramHref(username: string = site.contacts.telegram): string {
  const handle = username.trim().replace(/^@/, '');
  return `https://t.me/${handle}`;
}

/** WhatsApp click-to-chat link. Accepts digits or a formatted number. */
export function whatsappHref(number: string = site.contacts.whatsapp): string {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

/** `mailto:` link. */
export function mailtoHref(email: string = site.contacts.email): string {
  return `mailto:${email.trim()}`;
}
