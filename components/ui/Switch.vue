<template>
  <div
    class="flex gap-3 justify-between items-center text-black first-letter:uppercase font-normal text-lg"
  >
    <div
      v-if="props.labelRight"
      class="w-full text-black text-[12px] font-normal"
    >
      {{ props.labelRight }}
    </div>
    <label :for="props.id" role="switch" class="cursor-pointer">
      <div class="relative" :class="[disabledClass]">
        <input
          :id="props.id"
          ref="swtichInput"
          :value="props.value"
          :checked="isChecked"
          :true-value="props.activeValue"
          :false-value="props.inactiveValue"
          type="checkbox"
          class="sr-only"
          :name="name"
          :disabled="isDisabled"
          @change="handleChange"
        />

        <div
          class="rounded-[9.51914px] w-[30px] h-[16px]"
          :class="[colorChecked]"
        ></div>

        <div
          v-if="!props.disabled"
          class="dot absolute bg-white border border-gray-200 rounded-full transition w-[18px] h-[18px] -top-0.5"
        ></div>
        <div
          v-else
          class="dot absolute bg-gray-200 border border-transparent rounded-full transition w-[18px] h-[18px] -top-0.5"
        ></div>
      </div>
    </label>
    <div
      v-if="props.labelLeft"
      class="w-full first-letter:uppercase font-medium"
    >
      {{ props.labelLeft }}
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(["update:modelValue", "change"]);
const props = defineProps({
  id: {
    type: [String, Number],
    default: Math.floor(Math.random() * 1000000000),
    required: false,
  },
  labelRight: {
    type: String,
    default: "",
  },
  labelLeft: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  value: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [Array, Boolean],
    default: false,
  },
  activeColor: {
    type: String,
    default: "bg-primary ",
  },
  inactiveColor: {
    type: String,
    default: "bg-gray-300 border-transparent",
  },
  activeValue: {
    type: [Boolean, String, Number],
    default: true,
  },
  inactiveValue: {
    type: [Boolean, String, Number],
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const isChecked = computed(() => {
  return props.modelValue === props.activeValue;
});
const isDisabled = computed(() => {
  return props.disabled;
});
const colorChecked = computed(() => {
  let addClass = [];
  if (props.modelValue) {
    addClass = [props.activeColor];
  } else {
    addClass = [props.inactiveColor];
  }
  return addClass;
});

const disabledClass = computed(() => {
  let addClass = [];
  if (props.disabled) {
    addClass = ["cursor-not-allowed"];
  }
  return addClass;
});

const handleChange = (evt) => {
  const isChecked = evt.target.checked;
  emit("change", isChecked ? props.activeValue : props.inactiveValue);
  emit(
    "update:modelValue",
    isChecked ? props.activeValue : props.inactiveValue
  );
};
</script>

<style lang="scss">
input:checked ~ .dot {
  transform: translateX(100%);
  @apply transform translate-x-3.5 bg-white   border-white;
}
.dot {
  border: 0px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.0510643),
    0px 2px 2px rgba(0, 0, 0, 0.1), 0px 2px 2px rgba(0, 0, 0, 0.05);
}
</style>
