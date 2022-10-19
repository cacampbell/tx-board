import { nextTick, Plugin } from "vue";
import { createI18n, LocaleMessageDictionary } from "vue-i18n";
import { Router } from "vue-router";
import en from "../locales/en.json";

export default function setupI18n(): Plugin {
  const i18n = createI18n({
    legacy: false,
    // default to the browser-defined language
    locale: navigator.language.split("-")[0],
    fallbackLocale: "en",
    globalInjection: true,
    messages: {
      en,
    },
    numberFormats: {
      en: {
        currency: {
          style: "currency",
          currency: "USD",
          notation: "standard",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
    datetimeFormats: {
      en: {
        datetime: {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        },
      },
    },
  });

  return i18n;
}
