/**
 * UI string dictionary and locale helpers.
 *
 * The site ships Ukrainian-only but is built to extend. Components must read
 * every interface string through `useTranslations` — no hardcoded Ukrainian in
 * markup. Adding a locale (e.g. `en`) means: add it to `locales` in
 * `astro.config.mjs`, add an `en` key to `ui` below, and add content folders
 * `src/content/<collection>/en/`. No component changes needed.
 *
 * Keys are namespaced with a dot (`nav.services`) and can be extended by later
 * tasks as new sections are built.
 */

/** Locales the UI can render. Keep in sync with `astro.config.mjs`. */
export const locales = ['uk'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'uk';

/** Human-readable language names, for a future language switcher. */
export const languageLabels: Record<Locale, string> = {
  uk: 'Українська',
};

export const ui = {
  uk: {
    // --- Navigation ---
    'nav.services': 'Послуги',
    'nav.about': 'Про бюро',
    'nav.process': 'Як працюємо',
    'nav.faq': 'Питання',
    'nav.contacts': 'Контакти',

    // --- Calls to action / buttons ---
    'cta.consultation': 'Безкоштовна консультація',
    'cta.consultationLong': 'Отримати безкоштовну консультацію',
    'cta.telegram': 'Написати в Telegram',
    'cta.whatsapp': 'Написати у WhatsApp',
    'cta.call': 'Зателефонувати',
    'cta.discussSituation': 'Обговорити мою ситуацію',
    'cta.details': 'Детальніше',

    // --- Messengers ---
    'messenger.telegram': 'Telegram',
    'messenger.whatsapp': 'WhatsApp',
    'messenger.phone': 'Дзвінок',

    // --- Contacts block ---
    'contacts.title': 'Контакти',
    'contacts.orDirect': 'Або напишіть напряму',
    'contacts.phone': 'Телефон',
    'contacts.email': 'Пошта',
    'contacts.hours': 'Графік роботи',
    'contacts.online': 'Офіс — онлайн, працюємо з клієнтами по всій Україні',

    // --- Lead form ---
    'form.title': 'Залишити заявку',
    'form.name': "Ім'я",
    'form.phone': 'Телефон',
    'form.messenger': 'Зручний месенджер',
    'form.service': 'Напрямок',
    'form.serviceOther': 'Інше',
    'form.message': 'Опишіть ситуацію',
    'form.messageOptional': "Опишіть ситуацію (необов'язково)",
    'form.consent': 'Я погоджуюся з обробкою персональних даних',
    'form.submit': 'Надіслати заявку',
    'form.sending': 'Надсилаємо…',
    'form.success': "Дякуємо! Зв'яжемося протягом робочого дня.",
    'form.error': 'Не вдалося надіслати. Напишіть, будь ласка, у Telegram напряму.',
    'form.errorRequired': 'Заповніть це поле',
    'form.errorPhone': 'Введіть коректний номер телефону',
    'form.errorConsent': 'Потрібна згода на обробку даних',

    // --- Footer ---
    'footer.tagline': 'Адвокатське бюро · Київ · консультації онлайн по всій Україні',
    'footer.nav': 'Навігація',
    'footer.contacts': 'Контакти',
    'footer.privacy': 'Політика конфіденційності',
    'footer.rights': 'Усі права захищено',

    // --- Meta ---
    'meta.defaultTitle': 'Адвокатське бюро NM&P',

    // --- Common ---
    'common.brandSuffix': 'адвокатське бюро',
    'common.skipToContent': 'Перейти до основного вмісту',
    'common.menu': 'Меню',
    'common.close': 'Закрити',
  },
} as const;

/** Keys available in the dictionary (derived from the default locale). */
export type UIKey = keyof (typeof ui)[typeof defaultLocale];

/**
 * Returns a `t(key)` function bound to a locale, falling back to the default
 * locale when a string is missing (useful while a new locale is incomplete).
 */
export function useTranslations(locale: Locale = defaultLocale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key];
  };
}

/**
 * Reads the active locale from a URL's first path segment. Falls back to the
 * default locale (served from the root with `prefixDefaultLocale: false`).
 */
export function getLocaleFromUrl(url: URL): Locale {
  const [, maybeLocale] = url.pathname.split('/');
  if ((locales as readonly string[]).includes(maybeLocale)) {
    return maybeLocale as Locale;
  }
  return defaultLocale;
}

/**
 * Prefixes a path with the locale when it is not the default one. With
 * `prefixDefaultLocale: false`, default-locale paths are returned unchanged.
 */
export function localizePath(path: string, locale: Locale = defaultLocale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean}`;
}
