import InfiniteLoading from "v3-infinite-loading";
export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.component("infinite-loading", InfiniteLoading);
});
