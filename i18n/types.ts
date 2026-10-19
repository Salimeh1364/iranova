export type Locale = "en" | "de" | "fa";

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  gallery: {
    kicker: string;
    title: string;
    subtitle: string;
    roomName: string;
    previewNote: string;
    loading: string;
    unavailable: string;
  };
  language: {
    label: string;
    en: string;
    de: string;
    fa: string;
  };
};
