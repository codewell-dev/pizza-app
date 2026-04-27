export const locales = ["uk", "en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uk";

export const localeLabels: Record<Locale, string> = {
  uk: "UKR",
  en: "ENG",
  ru: "RUS",
};
