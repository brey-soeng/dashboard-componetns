<template>
  <div class="relative">
    <slot name="label">
      <UiLabel
        v-if="!!label && showLabel"
        :text="label"
        :labelClass="labelClass"
        :required="required"
      />
    </slot>
    <div
      class="st-input-wrapper flex items-center stretch relative w-full rounded text-lg font-medium"
      :class="{ 'bg-[#f0f1f3]': disabled }"
    >
      <slot name="prefix">
        <UiSvgIcon
          v-if="prefixIcon"
          :name="prefixIcon"
          :size="prefixIconSize"
          :class="[
            'absolute top-1/2 -translate-y-2/4 left-2 cursor-pointer text-gray-light hover:text-gray-600 z-10',
            { disabled: prefixDisabled },
          ]"
          @click="emitPrefixClick"
        />
      </slot>
      <div :class="inputClass">
        <div
          v-if="!focus && isCurrency"
          class="absolute top-1/2 -translate-y-1/2 bg-white w-[90%] z-20"
          @click="onClickOverlay"
        >
          {{
            modelValue
              ? currencyFormatSymbol({
                  value: modelValue,
                  symbol: "",
                  currency: props.ccy,
                })
              : ""
          }}
        </div>
        <input
          ref="myInput"
          v-maska
          :name="name"
          :data-maska="mask"
          class="appearance-none focus:outline-none focus:shadow-outline w-full bg-transparent caret-primary h-full placeholder:font-normal"
          :class="inputCls"
          :style="{ minHeight: props.minHeight }"
          :value="modelValue"
          :placeholder="toSentenceCase(placeholder)"
          :maxlength="maxlength"
          :minlength="minlength"
          :max="max"
          :min="min"
          :autocomplete="autocomplete"
          :type="inputType"
          :disabled="disabled"
          :autofocus="autofocus"
          @blur="onBlurInput"
          @input="emitModelValue"
          @focus="onFocusInput"
          @keypress="handleKeypress($event)"
          @keyup.enter="emitEnter"
          @paste="handleOnPaste($event)"
        />
      </div>
      <slot name="suffix" :data="{ meta }">
        <UiSvgIcon
          v-if="suffixIcon && !showClear"
          :name="suffixIcon"
          :size="suffixIconSize"
          :class="[
            suffixClass,
            'absolute top-1/2 -translate-y-2/4  cursor-pointer  hover:text-gray-600',
            { disabled: suffixDisabled },
            suffixColor,
          ]"
          @click="emitSuffixClick()"
        />
        <span class="border-gray-300 rounded-full bg-white">
          <UiSvgIcon
            v-if="showClear && !loading"
            name="Close"
            :size="!isBgClear ? '12' : '16'"
            :class="[
              {
                'right-[10px]': !suffixIcon,
                'right-2': suffixIcon,
                'absolute top-1/2  -translate-y-2/4 cursor-pointer   z-20': true,
                ' bg-[#9EA2AE] rounded-full p-[3px] bg-opacity-75': isBgClear,
              },
              isBgClear ? 'text-white' : 'text-[#9EA2AE]',
            ]"
            @click="handleClear"
          />

          <UiSvgIcon
            v-if="!loading && isMatchPassword"
            name="Match"
            size="13"
            :class="{
              'absolute top-1/2 right-9  -translate-y-2/4  z-20': true,
            }"
          />
        </span>

        <UiSvgIcon
          v-if="type === 'password' && !loading && !passwordVisible"
          name="ShowPassword"
          :class="{
            'right-3': !suffixIcon,
            'right-10': suffixIcon,
            'absolute top-1/2 -translate-y-2/4 cursor-pointer text-gray-light hover:text-gray-600 ': true,
          }"
          size="16"
          @click="handlePasswordVisible"
        />

        <UiSvgIcon
          v-else-if="type === 'password' && !loading && passwordVisible"
          name="HidePassword"
          :class="{
            'right-3': !suffixIcon,
            'right-9': suffixIcon,
            'absolute top-1/2 -translate-y-2/4 cursor-pointer text-gray-light hover:text-gray-600 ': true,
          }"
          size="16"
          @click="handlePasswordVisible"
        />

        <span
          :class="[
            'absolute top-1/2 -translate-y-2/4 cursor-pointer text-gray-light hover:text-gray-600',
            { 'right-3': !suffixIcon, 'right-10': suffixIcon },
          ]"
        >
          <svg
            v-if="loading"
            class="animate-spin w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <circle
              style="opacity: 0.25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              style="opacity: 0.75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      </slot>
    </div>
    <div class="relative" v-if="isSearchData">
      <slot name="searchList">
        <ul
          v-if="modelValue && searchData && searchData.length"
          class="shadow-md bg-white overflow-hidden peer-checked:flex flex-col w-full mt-1z-10 overflow-y-auto rounded absolute"
          :style="{ maxHeight: '200px' }"
        >
          <template v-for="(data, index) in searchData" :key="index">
            <li
              class="flex justify-between items-center"
              :class="{
                'py-3 px-3 hover:bg-gray-100 cursor-pointer': true,
                'border-t': index > 0,
              }"
              @click="handleSelectOption(data, index)"
            >
              <div class="flex flex-col">
                <h1 class="font-medium text-base capitalize text-[#081B37]">
                  {{ $_getValue(data, props.title) }}
                </h1>
                <span
                  v-if="props.subtittle"
                  class="text-[10px] font-normal text-[#6E6E73]"
                >
                  {{ $_getValue(data, `${props.subtittle}`) }}</span
                >
              </div>
              <UiSvgIcon
                v-if="
                  matchSelected === data[props.valueField] && props.checkIcon
                "
                class="text-primary"
                :name="props.checkIcon"
                size="20"
              />
            </li>
          </template>
        </ul>
        <div
          class="flex justify-center items-center py-4 first-letter:capitalize font-medium shadow-md bg-white"
          v-else-if="
            modelValue && focus && searchData && searchData.length <= 0
          "
        >
          No data found
        </div>
      </slot>

      <!-- </slot> -->
    </div>

    <div
      v-if="errorMessage"
      :class="props.textError ? props.textError : 'w-auto'"
      class="first-letter:uppercase z-10 font-normal text-base"
    >
      {{ errorMessage }}
    </div>
    <div v-if="showCounter" class="flex justify-end items-center">
      <span class="text-gray-light">
        {{ modelValue ? modelValue.length : 0 }} / {{ maxlength }}
        <span class="capitalize">Maximum Characters</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import debounce from "lodash.debounce";
import get from "lodash.get";
import { useField } from "vee-validate";
const emits = defineEmits([
  "prefix-click",
  "suffix-click",
  "done-typing",
  "update:modelValue",
  "change",
  "blur",
  "focus",
  "clear-click",
  "enter",
  "paste",
  "option-click",
]);
const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: null,
  },
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: String,
    default: "",
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  labelClass: {
    type: String,
    default: "text-[#6E6E73] text-base font-normal",
  },
  prefixIcon: {
    type: String,
    default: "",
  },
  prefixIconSize: {
    type: String,
    default: "20",
  },
  prefixDisabled: {
    type: Boolean,
    default: false,
  },
  suffixIcon: {
    type: String,
    default: "",
  },
  suffixIconSize: {
    type: String,
    default: "20",
  },
  suffixColor: {
    type: String,
    default: "text-gray-light",
  },
  suffixDisabled: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  maxlength: {
    type: Number,
    default: null,
  },
  minlength: {
    type: Number,
    default: null,
  },
  min: {
    type: Number,
    default: null,
  },
  max: {
    type: Number,
    default: null,
  },
  autocomplete: {
    type: String,
    default: "off",
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: [Boolean, Object],
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  searchData: {
    type: Array,
    default() {
      return [];
    },
  },
  isSearchData: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  focusColorBorder: {
    type: String,
    default: "border-[#0BBCD4]",
  },
  isBgClear: {
    type: Boolean,
    default: false,
  },
  digitNumber: {
    type: Boolean,
    default: false,
  },
  showCounter: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: null,
  },
  contentClass: { type: [String, Object, Array], default: "border rounded" },
  inputPadding: { type: String, default: "px-[10px]" },
  inputCls: { type: String, default: "text-base font-medium" },
  noSpecialChar: { type: Boolean, default: false },
  mask: { type: String, default: null },
  textOnly: {
    type: Boolean,
    default: false,
  },
  charException: {
    type: Array,
    default() {
      return [];
    },
  },
  rules: {
    type: [String, Object],
    default: null,
  },
  isCurrency: {
    type: Boolean,
    default: false,
  },
  isMatchPassword: {
    type: Boolean,
    default: false,
  },
  checkIcon: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "name",
  },
  subtittle: {
    type: String,
    default: "",
  },
  valueField: {
    type: String,
    default: "",
  },
  currencyLength: {
    type: [String, Number],
    default: 11,
  },
  numberOnly: {
    type: Boolean,
    default: false,
  },
  minHeight: {
    type: String,
    default: "30px",
  },
  suffixClass: {
    type: String,
    default: "right-2",
  },
  closeClass: {
    type: String,
    default: "",
  },
  textError: {
    type: String,
    default: "text-error",
  },
  borderError: {
    type: String,
    default: "border-error",
  },
  ccy: {
    type: String,
    default: "USD",
  },
  focusClass: {
    type: String,
    default: "",
  },
  isBackground: {
    type: Boolean,
    default: false,
  },
  multipleSelect: {
    type: Boolean,
    default: false,
  },
});

const myInput = ref();
const passwordVisible = ref(false);
const focus = ref(false);
const selectedIndex = ref(null);
const isClick = ref(false);
const matchSelected = ref("");
const { name, rules } = toRefs(props);
const { errorMessage, meta } = useField(name || "name", rules, {
  label: props.label,
  syncVModel: true,
});

watch(
  () => props.modelValue,
  (value) => {
    emits("update:modelValue", value);
  }
);

onMounted(() => {
  if (props.autofocus) {
    myInput.value.focus();
  }
});
const $_getValue = (object, string, defaultValue = "") => {
  return get(object, string, defaultValue);
};

const inputClass = computed(() => {
  return [
    {
      "st-input w-full h-full relative border  rounded ": true,
      "bg-white": props.isBackground && props.modelValue,
      "pl-8": props.prefixIcon,
      // "pr-[30px]": props.suffixIcon,
      // "border-[#0BBCD4]": focus.value,
      // "border-error": !focus.value & errorMessage.value,
      // "border-[#9EA2AE] border-opacity-30": focus.value && !errorMessage.value,
    },
    (props.clearable || props.suffixIcon) && focus.value
      ? "pr-[32px]"
      : "pr-[12px]",
    focus.value
      ? "border-[#0BBCD4] bg-white"
      : errorMessage.value
      ? "border-error"
      : "border-[#9EA2AE] border-opacity-30",
    // errorMessage.value ? props.borderError : "",
    // focus.value ? props.focusColorBorder : "",
    !showClear.value
      ? props.focusClass
        ? props.focusClass
        : props.contentClass
      : props.contentClass,
    props.inputPadding,
  ];
});

const showClear = computed(() => {
  return props.clearable && !props.disabled && props.modelValue && focus.value;
});

const inputType = computed(() => {
  return props.type === "password" && passwordVisible.value
    ? "text"
    : props.type === "number"
    ? "text"
    : props.type;
});

const toSentenceCase = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const emitWhenDoneTyping = debounce(function (value) {
  emits("done-typing", convertInput(value));
}, 500);

const emitPrefixClick = () => {
  return !props.prefixDisabled && emits("prefix-click");
};
const emitSuffixClick = () => {
  return !props.suffixDisabled && emits("suffix-click");
};
const emitModelValue = (input) => {
  // console.log("sdfdfddfd");
  const value = input.target.value; // convertInput(input.target.value)
  const newValue = props.type === "number" && value ? Number(value) : value;
  emits("update:modelValue", newValue);
  emits("change", newValue);
  emitWhenDoneTyping(newValue);
};

const onBlurInput = (input) => {
  setTimeout(() => {
    focus.value = false;
    const value = convertInput(input.target.value);
    const afterTrim = props.type === "number" ? value : value.trim();
    emits("update:modelValue", afterTrim);
    // emits("change", afterTrim);
    // emits("blur", input);
    // formatCurrency(value);
    // emits('done-typing', afterTrim)
    emits("blur");
  }, 200);
};

const formatCurrency = (value) => {
  if (props.isCurrency && (props.type === "number" || props.numberOnly)) {
    // let val = (value / 1).toFixed(2).replace(",", ".");
    let currency = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // emits("change", currency);
    // emits("blur", value);
    emits("update:modelValue", currency);
  }
};

const onFocusInput = () => {
  if (props.isCurrency && (props.type === "number" || props.numberOnly)) {
    const value = props.modelValue;
    const number = String(value).replace(/,/g, "");
    // emits("change", value ? number : "");
    // emits("blur", value ? number : "");
    emits("update:modelValue", value ? number : "");
  }
  emits("focus");
  focus.value = true;
};

const handleClear = () => {
  emits("update:modelValue", "");
  emits("change", "");
  emits("clear-click", "");
  emits("done-typing", "");
};

const handlePasswordVisible = (e) => {
  e.preventDefault();
  passwordVisible.value = !passwordVisible.value;
};

const checkSelected = (item) => {
  // console.log(item, item[props.valueField]);
  return item[props.valueField] === props.modelValue;
};

const handleSelectOption = (item, index) => {
  // checkSelected(item);
  // console.log("click", item[props.valueField]);
  matchSelected.value = item[props.valueField];

  isClick.value = true;
  selectedIndex.value = index;
  // emits("update:modelValue", item.name);
  // emits("change", item.name);
  emits("option-click", item);
};

const handleKeypress = (evt) => {
  const keyPressed = evt.key;
  const charRegex = /.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;

  if (props.textOnly) {
    let keyCode = evt.keyCode ? evt.keyCode : evt.which;
    if (keyCode > 47 && keyCode < 58) {
      evt.preventDefault();
    }
  }

  if (props.numberOnly) {
    let keyCode = evt.keyCode ? evt.keyCode : evt.which;
    if (keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
      evt.preventDefault();
    }
  }

  if (
    props.noSpecialChar &&
    charRegex.test(keyPressed) &&
    !props.charException.includes(evt.key)
  ) {
    evt.preventDefault();
  }

  if (props.type !== "number") return true;
  const keysAllowed = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  if (props.digitNumber && !keysAllowed.includes(".")) keysAllowed.push(".");

  if (!keysAllowed.includes(keyPressed)) {
    evt.preventDefault();
  }
  if (keyPressed === "." && evt.target.value.includes(keyPressed)) {
    evt.preventDefault();
  }

  if (props.isCurrency && props.type === "number") {
    const value = evt.target.value;
    if (value.length >= props.currencyLength) {
      evt.preventDefault();
    }
  }

  if (keyPressed === "." && !evt.target.value) {
    evt.preventDefault();
  }

  if (props.ccy === "KHR") {
    if (keyPressed === ".") {
      evt.preventDefault();
    }
  } else {
    if (
      typeof evt.target.selectionStart === "number" &&
      evt.target.selectionEnd !== evt.target.selectionStart &&
      keysAllowed.includes(keyPressed)
    ) {
      return true;
    }

    if (
      typeof evt.target.selectionStart === "number" &&
      evt.target.selectionEnd === evt.target.selectionStart &&
      keysAllowed.includes(keyPressed) &&
      +`${evt.target.value}${keyPressed}` > (props.max ? props.max : 2000000000)
    ) {
      evt.preventDefault();
    }

    if (
      get(evt.target.value.split("."), "[1].length") > 1 &&
      evt.target.selectionStart <= evt.target.value.length - 3 &&
      keysAllowed.includes(keyPressed)
    ) {
      return true;
    }

    if (get(evt.target.value.split("."), "[1].length") > 1) {
      evt.preventDefault();
    }
  }
};

const convertInput = (value) => {
  if (value && props.type === "number" && !props.isCurrency) {
    return parseFloat(value);
  }
  return value;
};

const emitEnter = (e) => {
  emits("enter", e.target.value);
};

const handleOnPaste = (evt) => {
  emits("paste", evt.clipboardData.getData("text"));
};

const onClickOverlay = () => {
  myInput.value.focus();
  // focus.value = true;
};
</script>
