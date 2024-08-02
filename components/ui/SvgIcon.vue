<template>
  <component
    :id="id"
    :is="dynamicComponent"
    class="svg-icon"
    :width="props.size"
    :height="sizeHeight || props.size"
    :stroke-width="props.strokeWidth"
  />
</template>

<script setup>
import { defineAsyncComponent, shallowRef } from "vue";
const dynamicComponent = shallowRef();
const props = defineProps({
  id: { type: String, default: "" },
  name: {
    type: String,
    required: true,
    validator: (value) => typeof value === "string" && value.trim().length > 0,
  },
  size: {
    type: [String, Number],
    default: 24,
    validator: (value) => !isNaN(parseFloat(value)) && isFinite(value),
  },
  strokeWidth: {
    type: [String, Number],
    default: 1,
    validator: (value) => !isNaN(parseFloat(value)) && isFinite(value),
  },
  sizeHeight: {
    type: [String, Number],
    default: "",
    validator: (value) =>
      value === "" || (!isNaN(parseFloat(value)) && isFinite(value)),
  },
});

watchEffect(() => {
  dynamicComponent.value = defineAsyncComponent({
    loader: () =>
      import(`~/components/icons/Icon${props.name}.vue`).catch((e) => ""),
    delay: 200,
    timeout: 3000,
  });
});
</script>
