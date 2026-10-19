import type { Locale } from "@/i18n/types";

const STORAGE_KEY = "iranova-locale";
const CHANGE_EVENT = "iranova-locale";

export function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "de" || value === "fa";
}

/** Pure read so the language store can hydrate without setting React state. */
export function readLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return isLocale(saved) ? saved : "en";
}

export function subscribeLocale(listener: () => void) {
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function writeLocale(locale: Locale) {
  window.localStorage.setItem(STORAGE_KEY, locale);
  // The native storage event does not fire in the tab that wrote the value.
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
