export const resize = {
  mounted(el, binding) {
    init(el, binding);
  },
  unmounted(el, binding) {
    if (!el._onResize?.[binding.instance.$.uid]) return;

    const { handler, options } = el._onResize[binding.instance.$.uid];

    window.removeEventListener("resize", handler, options);

    delete el._onResize[binding.instance.$.uid];
  },
};

function init(el, binding) {
  const handler = binding.value;
  const options = {
    passive: !binding.modifiers?.active,
  };

  window.addEventListener("resize", handler, options);

  el._onResize = Object(el._onResize);
  el._onResize[binding.instance.$.uid] = {
    handler,
    options,
  };

  if (!binding.modifiers?.quiet) {
    handler();
  }
}
