<template>
  <div>
    <div class="flex items-start">
      <div class="flex flex-row items-center" :class="[`h-${size}`]">
        <input
          :id="id"
          :value="value"
          :checked="isChecked"
          class="rounded border-[#BDC1CB] border-[1.5px] cursor-pointer text-primary form-checkbox focus:ring-0 focus:ring-transparent"
          :name="name"
          type="checkbox"
          :class="`w-${size} h-${size}`"
          :disabled="disabled"
          @change="handleChange"
          @focus="focus = true"
          @blur="focus = false"
        />
        <label
          v-if="label"
          :for="id"
          :style="fontSizeStyles"
          class="cursor-pointer text-lg"
          :class="customLabel"
        >
          <slot name="content">
            {{ label }}<span v-if="props.required" class="text-danger">*</span>
          </slot>
        </label>
      </div>
    </div>
    <div v-if="errorMessage" class="text-error py-1 first-letter:uppercase">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(["change", "update:modelValue"]);
import { useField } from "vee-validate";
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  value: {
    type: [String, Boolean, Number, Object, Array, Function],
    default: undefined,
  },
  size: {
    type: [Number, String],
    default: "5",
  },
  name: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [Array, Boolean],
    default: false,
  },
  trueValue: {
    type: Boolean,
    default: true,
  },
  falseValue: {
    type: Boolean,
    default: false,
  },
  fontSize: {
    type: [Number, String],
    default: "12",
  },
  color: { String, default: "" },
  disabled: { Boolean, default: false },
  rules: {
    type: [String, Object],
    default: null,
  },
  customLabel: {
    type: [Object, String],
    default: "first-letter:capitalize  px-2 text-gray-light ",
  },
});
const id = Math.floor(Math.random() * 1000000000);
const focus = ref(false);
const { errorMessage } = useField(props.name || "name", props.rules, {
  label: props.label,
  syncVModel: true,
});

const isChecked = computed(() => {
  if (props.modelValue instanceof Array) {
    return props.modelValue.includes(props.value);
  }
  return props.modelValue === props.trueValue;
});

const fontSizeStyles = computed(() => {
  return {
    "font-size": `${props.fontSize}px`,
    color: `${props.color}`,
  };
});

const handleChange = (evt) => {
  const isChecked = evt.target.checked;
  if (props.modelValue instanceof Array) {
    const newValue = [...props.modelValue];
    if (isChecked) {
      newValue.push(props.value);
    } else {
      newValue.splice(newValue.indexOf(props.value), 1);
    }
    emits("change", newValue);
    emits("update:modelValue", newValue);
  } else {
    emits("change", isChecked ? props.trueValue : props.falseValue);
    emits("update:modelValue", isChecked ? props.trueValue : props.falseValue);
  }
};
</script>
