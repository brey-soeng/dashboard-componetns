<template>
  <div>
    <UiLabel
      v-if="!!label"
      :text="label"
      labelClass="text-[#6E6E73]"
      marginBottom="mb-1"
    />
    <div
      class="flex text-white font-medium text-sm font-sp-pro-text bg-gray-200 rounded overflow-hidden"
    >
      <div v-if="isNoData" class="h-6 py-1.5 px-2">No data</div>
      <template v-else>
        <div
          v-if="value[0]"
          class="h-6 py-1.5 flex-none text-center overflow-hidden whitespace-nowrap"
          :class="[firstBgColor]"
          :style="{ width: `${getFirstPercentage}%` }"
        >
          {{ value[0] || 0 }}
        </div>

        <div
          v-if="value[1]"
          class="h-6 py-1.5 flex-grow text-center overflow-hidden whitespace-nowrap"
          :class="[secondBgColor]"
        >
          {{ value[1] || 0 }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { currencyFormatter } from "@/utils/currency";
const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  value: {
    type: Array,
    default: () => [50, 50],
  },
  firstBgColor: {
    type: String,
    default: "bg-primary",
  },
  secondBgColor: {
    type: String,
    default: "bg-[#E12A29]",
  },
});

const getTotalValue = computed(() => {
  return props.value[0] + props.value[1];
});

const getFirstPercentage = computed(() => {
  const total = getTotalValue.value;
  return (props.value[0] / total) * 100;
});

const isNoData = computed(() => {
  return !getTotalValue.value;
});
</script>
