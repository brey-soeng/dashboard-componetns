/* eslint-disable no-unused-vars */
import fallBackImage from "@/assets/images/fallback.svg";

export const imgFallback = {
  mounted(el, binding) {
    checkImage(el, binding);
    return;
  },
  updated(el, binding) {
    checkImage(el, binding);
  },
};

function checkImage(el, binding) {
  try {
    const { value } = binding;
    const img = new Image();

    // let loading = loader;
    let error = fallBackImage;
    let original = el.src;

    if (typeof value === "string") {
      // loading = value;
      error = value;
    }

    if (value instanceof Object) {
      // loading = value.imageLoader || loader;
      error = value.fallBackImage || fallBackImage;
    }

    img.src = original;
    // el.src = loading;

    img.onload = () => {
      el.src = original;
    };

    img.onerror = () => {
      el.src = error;
    };
  } catch (e) {
    console.log(e);
  }
}
