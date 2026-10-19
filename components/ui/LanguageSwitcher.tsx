"use client";

import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/types";

const options: { locale: Locale; code: string }[] = [
  { locale: "en", code: "EN" },
  { locale: "de", code: "DE" },
  { locale: "fa", code: "FA" },
];

export function LanguageSwitcher() {
  const { locale, messages, setLocale } = useI18n();

  return (
    <div className="language-switcher" role="group" aria-label={messages.language.label}>
      {options.map((option) => (
        <button
          key={option.locale}
          type="button"
          lang={option.locale}
          aria-label={messages.language[option.locale]}
          aria-pressed={locale === option.locale}
          onClick={() => setLocale(option.locale)}
        >
          {option.code}
        </button>
      ))}
    </div>
  );
}
