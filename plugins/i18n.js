import { createI18n } from "vue-i18n";
import en from "@/lang/en.json";
import km from "@/lang/km.json";
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "en",
    messages: {
      en,
      km,
    },
  });

  nuxtApp.i18n = i18n;

  nuxtApp.vueApp.use(i18n);
});
