<template>
  <div
    v-if="text"
    class="first-letter:uppercase"
    :class="[labelClass, marginBottom]"
  >
    {{ text }}
    <span v-if="required" class="text-error">*</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: null,
  },
  labelClass: {
    type: String,
    default: "text-[#6E6E73] text-base font-normal",
  },
  required: {
    type: Boolean,
    default: false,
  },
  marginBottom: {
    type: String,
    default: "mb-2",
  },
});
</script>
