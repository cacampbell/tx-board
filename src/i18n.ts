import { nextTick, Plugin } from "vue";
import { createI18n, LocaleMessageDictionary } from "vue-i18n";
import { Router } from "vue-router";
import en from "../locales/en.json";

// everything BUT en, vite will deduplicate from the explicit en import
const addtlLocaleModules = import.meta.glob("../locales/*.json");

export default function setupI18n(router: Router): Plugin {
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

  // support reacting to ?lang=_
  router.beforeEach(async (to) => {
    const locale =
      to.query.lang != null ? (to.query.lang as string).split("-")[0] : "en";

    const localeModule = `../locales/${locale}.json`;

    if (!(localeModule in addtlLocaleModules)) {
      // locale is not supported, default to en
      return {
        ...to,
        query: {
          ...to.query,
          lang: "en",
        },
      };
    }

    if (locale !== i18n.global.locale.value) {
      if (!i18n.global.availableLocales.includes(locale)) {
        // load locale messages with dynamic import
        const messages = (await addtlLocaleModules[localeModule]()) as {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          default: LocaleMessageDictionary<any>;
        };

        // set locale and locale message
        i18n.global.setLocaleMessage(locale, messages.default);
        i18n.global.setDateTimeFormat(
          locale,
          i18n.global.datetimeFormats.value.en
        );

        await nextTick();
      }

      // reactively change the current language to ?lang=_
      i18n.global.locale.value = locale;

      // mark the current lang in <html>
      document.documentElement.setAttribute("lang", locale);
    }
  });

  return i18n;
}
