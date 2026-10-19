"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { de } from "@/i18n/de";
import { en } from "@/i18n/en";
import { fa } from "@/i18n/fa";
import { readLocale, subscribeLocale, writeLocale } from "@/i18n/locale";
import type { Dictionary, Locale } from "@/i18n/types";

const dictionaries: Record<Locale, Dictionary> = { en, de, fa };

type I18nContextValue = {
  locale: Locale;
  messages: Dictionary;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getServerLocale(): Locale {
  // The first HTML is English. A saved language is applied after hydration
  // so the WebGL canvas is never remounted by a route change.
  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribeLocale, readLocale, getServerLocale);
  const messages = dictionaries[locale];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    // Persian reads right to left. The direction lives on the document so the
    // canvas is not remounted when the interface flips.
    root.dir = locale === "fa" ? "rtl" : "ltr";
    document.title = messages.meta.title;
  }, [locale, messages.meta.title]);

  const value = useMemo(
    () => ({
      locale,
      messages,
      setLocale: writeLocale,
    }),
    [locale, messages],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
