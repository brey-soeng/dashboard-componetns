<template>
  <div>
    <div class="shadow w-full" :class="[backgroundCls]">
      <div class="" :class="[activeCls]" :style="{ width: `${percentage}%` }">
        {{ percentage }}%
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  backgroundCls: {
    type: String,
    default: "bg-grey-light",
  },
  activeCls: {
    type: String,
    default: "bg-orange text-xs leading-none py-1 text-center text-white",
  },
  percentage: { type: [String, Number], default: 0 },
});
</script>
