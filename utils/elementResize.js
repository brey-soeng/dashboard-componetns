import { ref, watch } from "vue";

export default function useElementSize(element) {
  const width = ref(0);
  const height = ref(0);

  let observer = null;

  function disconnect() {
    if (observer !== null) {
      observer.disconnect();
    }
  }

  function connect(element) {
    disconnect();
    observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) {
        width.value = rect.width;
        height.value = rect.height;
      }
    });

    observer.observe(element);
  }

  watch(element, (el) => {
    if (el && el !== null) {
      connect(el);
    } else {
      disconnect();
    }
  });

  return {
    width,
    height,
  };
}
