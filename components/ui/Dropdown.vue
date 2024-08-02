<template>
  <div
    class="absolute bg-white text-black text-base rounded dropdown-container transition-all dropdown-animate"
    :class="[show ? 'block' : 'hidden', contentCls, zindex]"
  >
    <span
      v-if="arrow"
      class="absolute w-2 h-2 content-[' '] bg-white rounded-tl-sm rotate-45 z-50"
      :class="[arrowCls]"
    ></span>
    <slot> </slot>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  contentCls: {
    type: String,
    default: "top-[60px] right-[13px]",
  },
  arrow: {
    type: Boolean,
    default: false,
  },
  arrowCls: {
    type: String,
    default: "-top-[4px] right-6",
  },
  zindex: {
    type: String,
    default: "z-[30]",
  },
});
</script>

<style>
.dropdown-container {
  /* box-shadow: 0px 4px 12px rgba(8, 27, 55, 0.1); */
  box-shadow: 0px 6px 16px 0px #2929293d;
}
</style>
