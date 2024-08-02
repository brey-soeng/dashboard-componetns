import { clickOutside } from "@/directives/click-outside";
import { imgFallback } from "@/directives/img-fallback";
import { safeHtml, allowedTags } from "@/directives/safe-html";
import { vMaska } from "maska/vue"
import { resize } from "@/directives/resize";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("click-outside", clickOutside);
  nuxtApp.vueApp.directive("img-fallback", imgFallback);
  nuxtApp.vueApp.directive("maska", vMaska);
  nuxtApp.vueApp.directive("safe-html", safeHtml(allowedTags));
  nuxtApp.vueApp.directive("resize", resize);
});
