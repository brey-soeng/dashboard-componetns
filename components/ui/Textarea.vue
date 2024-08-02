<template>
  <div class="textarea">
    <UiLabel v-if="!!label" :text="label" :required="required" />
    <div
      class="relative border rounded-md flex justify-between items-start"
      :class="[{ 'border-primary': isFocus }, { 'border-error': errorMessage }]"
    >
      <div class="w-full p-[2px]">
        <textarea
          id="message"
          :value="modelValue"
          :rows="rows"
          :cols="cols"
          class="block px-2 py-1 w-full text-black focus:outline-none font-medium pr-14 overflow-y-auto"
          :class="[customClass, inputClass]"
          :placeholder="placeholder"
          :maxlength="counter"
          @blur="onBlur"
          @input="onInput"
          @focus="onFocus"
        ></textarea>
      </div>
      <span
        v-if="isTopCounter"
        class="w-auot absolute right-2 top-1 font-semibold text-base text-[#6E6E73] py-1 flex justify-end px-1"
      >
        {{ modelValue ? modelValue.length : 0 }}/
        <span class="font-normal text-base">{{ counter }}</span>
      </span>
    </div>
    <div v-if="errorMessage" class="text-error py-1 first-letter:uppercase">
      {{ errorMessage }}
    </div>
    <div v-if="!isTopCounter" class="flex justify-between items-center">
      <span></span>
      <span v-if="counter" class="text-gray-light"
        >{{ modelValue ? modelValue.length : 0 }} / {{ counter }}
        <span class="capitalize">Characters</span></span
      >
    </div>
  </div>
</template>

<script setup>
import { useField } from "vee-validate";

const emits = defineEmits([
  "update:modelValue",
  "update:counterDanger",
  "change",
  "focus",
  "blur",
]);
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
  },
  label: {
    type: String,
    default: "",
  },
  cols: {
    type: [Number, String],
    default: null,
  },
  rows: {
    type: [Number, String],
    default: null,
  },
  placeholder: {
    type: String,
    default: "",
  },
  counter: {
    type: Number,
    default: null,
  },
  required: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: "text-base",
  },
  name: {
    type: String,
    default: null,
  },
  rules: {
    type: [String, Object],
    default: null,
  },
  isTopCounter: {
    type: Boolean,
    default: false,
  },
});
const isFocus = ref(false);

const { errorMessage } = useField(props.name || "name", props.rules, {
  label: props.label,
  syncVModel: true,
});

watch(
  () => props.modelValue,
  (val) => {
    if (val && val.length > props.counter) {
      emits("update:counterDanger", true);
    } else {
      emits("update:counterDanger", false);
    }
  }
);

const inputClass = computed(() => {
  return {
    "border-primary": isFocus.value,
    "border-error": errorMessage.value,
  };
});

const onInput = (evt) => {
  emits("update:modelValue", evt.target.value);
  emits("change", evt.target.value);
};
const onFocus = () => {
  isFocus.value = true;
  emits("focus");
};
const onBlur = () => {
  isFocus.value = false;
  emits("blur");
};
</script>
