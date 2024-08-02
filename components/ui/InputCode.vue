<template>
  <div>
    <slot name="label">
      <UiLabel v-if="!!label" :text="label" />
    </slot>
    <div class="grid grid-cols-6 gap-3 input-code">
      <UiInput
        :maxlength="1"
        v-model="arrayValue.input1"
        digitNumber
        name="input1"
        type="number"
        inputPadding="px-1"
        :contentClass="contentClass"
        :inputCls="inputClass"
        @change="(value) => onChange(value, 0)"
        @paste="(value) => onPaste(value, 0)"
      />
      <UiInput
        :maxlength="1"
        v-model="arrayValue.input2"
        digitNumber
        name="input2"
        type="number"
        inputPadding="px-1"
        :contentClass="contentClass"
        :inputCls="inputClass"
        @change="(value) => onChange(value, 1)"
        @paste="(value) => onPaste(value, 1)"
      />
      <UiInput
        :maxlength="1"
        v-model="arrayValue.input3"
        digitNumber
        name="input3"
        type="number"
        inputPadding="px-1"
        :contentClass="contentClass"
        :inputCls="inputClass"
        @change="(value) => onChange(value, 2)"
        @paste="(value) => onPaste(value, 2)"
      />
      <UiInput
        :maxlength="1"
        v-model="arrayValue.input4"
        digitNumber
        name="input4"
        type="number"
        inputPadding="px-1"
        :contentClass="contentClass"
        :inputCls="inputClass"
        @change="(value) => onChange(value, 3)"
        @paste="(value) => onPaste(value, 3)"
      />
      <UiInput
        :maxlength="1"
        v-model="arrayValue.input5"
        digitNumber
        name="input5"
        type="number"
        inputPadding="px-1"
        :contentClass="contentClass"
        :inputCls="inputClass"
        @change="(value) => onChange(value, 4)"
        @paste="(value) => onPaste(value, 4)"
      />
      <UiInput
        :maxlength="1"
        v-model="arrayValue.input6"
        digitNumber
        name="input6"
        type="number"
        inputPadding="px-1"
        :contentClass="contentClass"
        :inputCls="inputClass"
        @change="(value) => onChange(value, 5)"
        @paste="(value) => onPaste(value, 5)"
      />
    </div>
    <div v-if="errorMessage" class="text-error first-letter:uppercase">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { useField } from "vee-validate";

const emits = defineEmits(["update:modelValue", "change"]);
const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  modelValue: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  rules: {
    type: [String, Object],
    default: null,
  },
});

const { errorMessage } = useField(props.name || "name", props.rules, {
  label: "Verification code",
});

const contentClass = "rounded border px-1 text-center";
const inputClass = "text-center";
const arrayValue = ref({
  input1: null,
  input2: null,
  input3: null,
  input4: null,
  input5: null,
  input6: null,
});
const inputs = ref(null);

onMounted(() => {
  inputs.value = Array.prototype.slice.call(
    document.querySelectorAll(".input-code input")
  );
});

watch(
  () => arrayValue.value,
  (value) => {
    console.log(value);
  }
);

const onChange = (value, index) => {
  if (value && index < 5) {
    focusNext(index + 1);
  }

  const { input1, input2, input3, input4, input5, input6 } = arrayValue.value;
  const checkAllFilled =
    checkValue(input1) &&
    checkValue(input2) &&
    checkValue(input3) &&
    checkValue(input4) &&
    checkValue(input5) &&
    checkValue(input6);

  if (checkAllFilled) {
    const newValue = `${input1}${input2}${input3}${input4}${input5}${input6}`;
    emits("update:modelValue", newValue);
    emits("change", newValue);
  }
};

const checkValue = (value) => {
  return value !== null && value !== "" && value !== undefined;
};

const focusNext = (index) => {
  const input = inputs.value[index];
  input.focus();
};

const onPaste = (value, index) => {
  const valueTrim = value.replaceAll(" ", "").trim();
  if (valueTrim && valueTrim.length && valueTrim.length >= index - 1) {
    const arrString = valueTrim.split("");

    arrString.forEach((x, key) => {
      arrayValue.value[`input${index + 1 + key}`] = x;
    });
  }
};
</script>
