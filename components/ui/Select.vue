<template>
  <div :id="id" ref="myElement" class="relative">
    <slot name="label">
      <UiLabel v-if="!!label" :text="label" :required="required" />
    </slot>
    <div v-click-outside="handleClickOutside">
      <div
        :class="[
          ...customClass,
          'flex items-center appearance-none focus:outline-none focus:shadow-outline h-[32px] select-class border rounded',
          { 'border-error': errorMessage },
          {
            'border-[#9EA2AE] border-opacity-30':
              !visibleDropdown && !errorMessage,
          },
          { 'border-[#0BBCD4] bg-white ': visibleDropdown },
          disabled ? 'cursor-not-allowed bg-[#f0f1f3]' : 'cursor-pointer',
        ]"
        @click="handleClickInputContent"
      >
        <div class="flex w-full h-[32px] rounded overflow-hidden">
          <div
            v-if="!multipleSelect && selectedItemValue && !visibleDropdown"
            :class="[
              { 'text-[#9EA2AE]': disabled },
              customPlaceholder ? customPlaceholder : customOption,
            ]"
            class="w-full absolute text-[#081B37] px-[10px] py-2 truncate overflow-hidden text-base font-normal rounded"
          >
            {{ selectedItemValue }}
          </div>
          <div
            v-else-if="
              multipleSelect && selectedItemValue.length > 0 && !props.isTooltip
            "
            class="flex py-1 px-2 space-x-1 flex-grow flex-row"
          >
            <template v-for="(item, index) in selectedItemValue">
              <span
                v-if="
                  !collapseTags ||
                  (collapseTags && isResize ? index <= 1 : index === 0)
                "
                :key="index"
                class="flex flex-row bg-gray-100 px-2 py-0.5 text-xs rounded-full space-x-1 items-center"
                :class="{ 'cursor-not-allowed text-[#9EA2AE]': disabled }"
              >
                <span class="pr-1 block whitespace-nowrap capitalize"
                  >{{
                    isTruncate
                      ? truncateInsideString(item[labelField], 2, 4, "...")
                      : item[labelField]
                  }}
                </span>
                <span
                  v-if="!props.isIconClose"
                  @click="(e) => onClickRemoveValue(e, item)"
                  class="text-white p-[3px] bg-[#9EA2AE] rounded-full cursor-pointer font-medium"
                  :class="{
                    'cursor-not-allowed bg-gray-200': disabled,
                  }"
                >
                  <UiSvgIcon name="MultiClose" size="8" />
                </span>
              </span>
              <span
                v-if="collapseTags && isResize ? index === 2 : index === 1"
                :key="index"
                :class="{ ' text-[#9EA2AE]': disabled }"
                class="border-r pr-1 whitespace-nowrap bg-gray-100 p-1 text-xs rounded-full items-center flex justify-center"
              >
                +
                {{ selectedItemValue.length - (isResize ? 2 : 1) }}
              </span>
            </template>
          </div>
          <div
            v-else-if="
              multipleSelect && selectedItemValue.length > 0 && props.isTooltip
            "
            iconClass="text-white"
            class="py-1 px-2 relative"
          >
            <UiToolTip
              :content="getHoverSelected(selectedItemValue)"
              customClass="w-auto py-2 px-2 shadow max-w-[250px] z-30 bg-white capitalize"
            >
              <div class="flex space-x-1 pb-[2px] px-2">
                <template v-for="(item, index) in selectedItemValue">
                  <span
                    v-if="
                      !collapseTags ||
                      (collapseTags && isResize ? index <= 1 : index === 0)
                    "
                    :key="index"
                    class="flex flex-row bg-gray-100 px-2 text-xs rounded-full space-x-2 items-center p-1"
                    :class="{ 'cursor-not-allowed text-[#9EA2AE]': disabled }"
                  >
                    <span class="pr-1 block whitespace-nowrap capitalize"
                      >{{
                        isTruncate
                          ? truncateInsideString(item[labelField], 2, 4, "...")
                          : item[labelField]
                      }}
                    </span>
                    <span
                      v-if="!props.isIconClose"
                      @click="(e) => onClickRemoveValue(e, item)"
                      class="text-white p-[3px] bg-[#9EA2AE] rounded-full cursor-pointer font-medium"
                      :class="{
                        'cursor-not-allowed bg-gray-200': disabled,
                      }"
                    >
                      <UiSvgIcon name="MultiClose" size="8" />
                    </span>
                  </span>
                  <span
                    v-if="collapseTags && isResize ? index === 2 : index === 1"
                    :key="index"
                    :class="{ ' text-[#9EA2AE]': disabled }"
                    class="border-r pr-1 whitespace-nowrap bg-gray-100 p-1 text-xs rounded-full items-center flex justify-center"
                  >
                    +
                    {{ selectedItemValue.length - (isResize ? 2 : 1) }}
                  </span>
                </template>
              </div>
            </UiToolTip>
          </div>

          <input
            ref="myInput"
            :name="name"
            v-model="inputValue"
            :class="[
              `appearance-none  h-full w-full cursor-pointer  font-medium placeholder:first-letter:capitalize flex-grow border-transparent border-0 outline-none bg-transparent rounded placeholder:font-normal`,
              {
                'px-[10px]':
                  !multipleSelect ||
                  (multipleSelect && selectedItemValue.length <= 0),
                'cursor-not-allowed bg-transparent text-gray-light': disabled,
              },
              customOption,
              customInput,
              { 'placeholder:text-[#081B37]': visibleDropdown },
            ]"
            autocomplete="off"
            :placeholder="
              !multipleSelect && !visibleDropdown && selectedItemValue
                ? ''
                : placeholderText
            "
            :disabled="disabled"
            :readonly="!filterable"
            @keyup.enter="onEnterInput"
            @keydown.delete="deletePrevTag"
            @input="debouncedQueryChange"
          />
        </div>

        <span class="text-primary" v-if="selectLoading">
          <svg
            class="animate-spin w-4 h-4 mr-2"
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

        <button
          v-else-if="
            selectedItemValue &&
            selectedItemValue.length > 0 &&
            clearable &&
            visibleDropdown
          "
          type="button"
          class="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600 clear-button"
          @click="onClickRemoveAllValue"
        >
          <UiSvgIcon
            name="Close"
            class="align-middle m-auto mx-1 text-gray-light hover:text-gray-600"
            size="10"
          />
        </button>
        <span
          :class="[
            'cursor-pointer outline-none focus:outline-none transition-all text-gray-light pr-2',
            {
              'hover:text-gray-600': !disabled,
              'cursor-not-allowed': disabled,
            },
          ]"
        >
          <UiSvgIcon
            name="ArrowDown"
            size="12"
            :class="{
              '-rotate-180': !visibleDropdown,
              'transition-all': true,
            }"
          />
        </span>
      </div>

      <div
        v-if="visibleDropdown"
        class="absolute rounded overflow-hidden peer-checked:flex scrollbar-hide flex-col mt-1 bg-white z-30 overflow-y-auto"
        style="box-shadow: 0px 4px 12px 0px #081b371a"
        :class="[
          {
            'py-2': props.filterName,
            'pb-[10px]': !props.filterName,
          },
          dropdownWidth ? dropdownWidth : 'w-full',
        ]"
        :style="styleObject"
      >
        <!-- remove border -->
        <div class="bg-white sticky z-40 my-2 px-4" v-if="props.filterName">
          <h1
            class="flex justify-between w-full items-start text-[20px] leading-[28px] font-semibold text-[#081B37]"
          >
            <span>{{ props.filterName }}</span>
            <button class="flex justify-center items-center h-[24px] w-[24px]">
              <UiSvgIcon
                name="Close"
                size="10"
                class="text-primary cursor-pointer"
                @click="visibleDropdown = false"
              />
            </button>
          </h1>
        </div>
        <div>
          <div v-if="data.length > 0">
            <template v-for="(item, index) in data">
              <div
                v-if="
                  modelValue === item[valueField] ||
                  !disabledIds.includes(item[valueField])
                "
                :key="index"
                :class="[
                  'cursor-pointer group',
                  {
                    disabled: item.disabled,
                  },
                ]"
                @click="selectOptionClick(item)"
              >
                <div :item="item">
                  <div
                    :class="[
                      'block    group-hover:bg-[#F3F3F6] group-hover:bg-opacity-60 relative',
                      {
                        'px-4 py-[10px]': props.filterName,
                        'px-[10px] py-[7px]': !props.filterName,
                      },
                      checkSelected(item)
                        ? props.activeColor
                        : 'text-[#081B37]',
                    ]"
                  >
                    <div>
                      <slot
                        name="option-value"
                        :data="item"
                        :data-index="index"
                      >
                        <div
                          class="flex justify-between items-center h-[24px]"
                          :class="listClass"
                        >
                          <h1 :class="customOption">
                            {{ item[labelField] }}
                          </h1>
                          <UiSvgIcon
                            class="text-primary"
                            v-if="checkSelected(item) && props.suffixIcon"
                            :name="props.suffixIcon"
                            size="24"
                          />
                        </div>
                      </slot>

                      <div
                        v-if="index >= 1"
                        class="absolute left-0 -top-[1px] w-full"
                        :class="{
                          'px-4': props.filterName,
                          'px-[10px]': !props.filterName,
                        }"
                      >
                        <div class="h-[1px] bg-[#E9EAEF]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <slot v-if="remote" name="infinite-scroll"> </slot>
          </div>

          <div v-else class="text-center py-2 text-sm">No matching data</div>
        </div>
      </div>
    </div>

    <div
      v-if="props.customMessage && selectedItemValue.length && !visibleDropdown"
      class="text-error first-letter:uppercase"
    >
      {{ props.customMessage }}
    </div>

    <div v-if="errorMessage" class="text-error first-letter:uppercase">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import debounce from "lodash.debounce";
import { useField } from "vee-validate";
import { truncateInsideString } from "@/utils/index";

const emits = defineEmits([
  "update:modelValue",
  "change",
  "blur",
  "click-outside",
]);
const props = defineProps({
  loading: { type: Boolean, default: false },
  multipleSelect: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  dataSource: {
    type: [Array, String, Number],
    default() {
      return [];
    },
  },
  placeholder: { type: String, default: "Select" },
  label: { type: String, default: "" },
  id: { type: String, default: "" },
  labelField: { type: String, default: "name" },
  valueField: { type: String, default: "id" },
  // errorMessage: { type: String, default: "" },
  clearable: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  remote: { type: Boolean, default: false },
  searchField: { type: String, default: "name" },
  collapseTags: { type: Boolean, default: false },
  multipleLimit: { type: Number, default: 0 },
  modelValue: {
    type: [String, Array, Object, Number, Boolean],
    default: () => "",
  },
  filterMethod: { type: Function, default: () => {} },
  defaultFirstOption: { type: Boolean, default: false },
  popperClass: { type: String, default: "st-select uk-text-12" },
  remoteMethod: { type: Function, default: () => {} },
  size: { type: String, default: "small" },
  noMargin: { type: Boolean, default: false },
  prefixedId: { type: String, default: "" },
  maxDropdownHight: { type: String, default: "265px" },
  contentClass: {
    type: [Object, Array, String],
    default: "w-full border rounded border-[#9EA2AE] border-opacity-30 ",
  },
  disabledIds: {
    type: Array,
    default() {
      return [];
    },
  },
  name: {
    type: String,
    default: null,
  },
  suffixIcon: {
    type: String,
    default: "",
  },
  rules: {
    type: [String, Object],
    default: null,
  },
  customOption: {
    type: [String, Object],
    default: "first-letter:capitalize",
  },
  listClass: {
    type: String,
    default: "first-letter:capitalize ",
  },
  customInput: {
    type: String,
    default: "text-base",
  },
  filterName: {
    type: String,
    default: "",
  },
  customMessage: {
    type: String,
    default: "",
  },
  isTruncate: {
    type: Boolean,
    default: false,
  },
  disableClss: {
    type: String,
    default: "bg-[#f0f1f3]",
  },
  activeColor: {
    type: String,
    default: "text-primary",
  },
  allowSelectNull: {
    type: Boolean,
    default: false,
  },
  dropdownWidth: {
    type: String,
    default: "",
  },
  customPlaceholder: {
    type: String,
    default: "",
  },
  isBackground: {
    type: Boolean,
    default: false,
  },
  isIconClose: {
    type: Boolean,
    default: false,
  },
  isTooltip: {
    type: Boolean,
    default: false,
  },
  tempValue: {
    type: [Array, Object],
    default: null,
  },
});
const { name, rules } = toRefs(props);
const { errorMessage } = useField(name || "name", rules, {
  label: props.label,
  syncVModel: true,
});

const myInput = ref();
const myElement = ref();
const visibleDropdown = ref(false);
const data = ref(props.dataSource);
const styleObject = ref({ maxHeight: props.maxDropdownHight });
const inputValue = ref(null);
const selectLoading = ref(props.loading);
const selectedValue = ref("");
const isResize = ref(false);
const focus = ref(false);

watch(
  () => visibleDropdown.value,
  (value) => {
    checkDropdownPosition();
    inputValue.value = "";
    handleQueryChange("");
  }
);

watch(
  () => props.loading,
  (value) => {
    selectLoading.value = value;
  }
);

onMounted(() => {
  // Check dropdown position when MOUNTED
  checkDropdownPosition();

  // Check dropdown position when WINDOWN RESIZE
  window.onresize = checkDropdownPosition();

  nextTick(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    handleScroll();
  });
});

onBeforeUnmount(() => {
  window.onresize = undefined;
});

const handleResize = () => {
  isResize.value = window.innerWidth > 1280 ? true : false;
};

const customClass = computed(() => {
  return [
    {
      "bg-white":
        props.isBackground && props.modelValue && props.modelValue !== "ALL",
    },
  ];
});

const selectedItemValue = computed(() => {
  if (props.multipleSelect) {
    const selected = props.dataSource.filter(
      (x) => props.modelValue && props.modelValue.includes(x[props.valueField])
    );
    return selected;
  } else {
    const selected = props.dataSource.find(
      (x) => x[props.valueField] === props.modelValue
    );
    return selected ? selected[props.labelField] : null;
  }
});

const placeholderText = computed(() => {
  if (props.multipleSelect) {
    return selectedItemValue.value && selectedItemValue.value.length > 0
      ? ""
      : toSentenceCase(props.placeholder);
  } else {
    return selectedItemValue.value
      ? toSentenceCase(selectedItemValue.value)
      : toSentenceCase(props.placeholder);
  }
});

const toSentenceCase = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const checkSelected = (item) => {
  if (item[props.valueField]) {
    if (props.multipleSelect) {
      return (
        props.modelValue && props.modelValue.includes(item[props.valueField])
      );
    } else {
      return item[props.valueField] === props.modelValue;
    }
  }
};
const onFocusInput = () => {
  visibleDropdown.value = true;
};

const onBlurInput = () => {
  visibleDropdown.value = false;
  emits("blur");
};

const onEnterInput = () => {
  visibleDropdown.value = true;
};
const selectOptionClick = (item) => {
  if (item.disabled) return;
  if (props.multipleSelect) {
    const value = props.modelValue ? props.modelValue : [];
    const isSelected = value.includes(item[props.valueField]);
    const secondArray = new Set([...value, item[props.valueField]]);
    const newArray = props.tempValue.filter((x) => secondArray.has(x));

    const newSelectedValue = isSelected
      ? value.filter((x) => x !== item[props.valueField])
      : props.tempValue &&
        props.tempValue.length === [...value, item[props.valueField]].length
      ? newArray
      : [...value, item[props.valueField]];

    myInput.value.focus();
    emits("update:modelValue", newSelectedValue);
    emits("change", newSelectedValue);
    // visibleDropdown.value = false;
  } else {
    visibleDropdown.value = false;
    inputValue.value = null;
    handleQueryChange("");
    emits("update:modelValue", item[props.valueField]);
    emits("change", item[props.valueField]);
    selectedValue.value = item[props.valueField];
  }
};

const onClickRemoveAllValue = () => {
  visibleDropdown.value = false;
  emits("update:modelValue", props.multipleSelect ? [] : null || "");
  emits("change", props.multipleSelect ? [] : null || "");
};

const onClickRemoveValue = (e, item) => {
  e.preventDefault();
  if (props.disabled) return;
  emits(
    "update:modelValue",
    props.modelValue.filter((x) => x !== item[props.valueField])
  );
  emits("change", null);
};

// Handle when CLICK OUTSIDE select will hide DROPDOWN
const handleClickOutside = () => {
  visibleDropdown.value = false;
};

const debouncedQueryChange = debounce(function (e) {
  if (props.filterable) {
    handleQueryChange(e.target.value);
  }
}, 500);

const extraData = () => {
  const obj = {};
  obj[props.labelField] = "Deselect";
  obj[props.valueField] = null;
  return obj;
};

const getDataSource = computed(() => {
  const extra = props.allowSelectNull && props.modelValue ? [extraData()] : [];
  return [...extra, ...props.dataSource];
});

const handleQueryChange = (value = "") => {
  // console.log(getDataSource.value);
  if (!value) data.value = getDataSource.value;
  selectLoading.value = true;
  if (props.remote) {
    //
  } else {
    data.value = getDataSource.value.filter((x) =>
      x[props.labelField].toString().toLowerCase().includes(value.toLowerCase())
    );
  }
  selectLoading.value = false;
};

const deletePrevTag = (e) => {
  if (e.target.value.length <= 0 && props.modelValue && props.multipleSelect) {
    const value = props.modelValue.slice();
    value.pop();
    emits("update:modelValue", value);
    emits("change", value);
  }
};

const handleClickInputContent = () => {
  if (props.disabled) return false;

  visibleDropdown.value = !visibleDropdown.value;
};

const checkDropdownPosition = () => {
  const selectPosition = myElement.value
    ? myElement.value.getBoundingClientRect().bottom
    : 100;
  if (window.innerHeight - selectPosition < 260) {
    styleObject.value.bottom = `${myInput.value.clientHeight + 5}px`;
  } else {
    styleObject.value.bottom = "unset";
  }
};

const getHoverSelected = (data) => {
  let spanContent = "";
  data.forEach((item, index) => {
    spanContent += `${item.displayValue}${
      index !== data.length - 1 ? ",  " : ""
    }`;
  });
  return spanContent;
};

const handleScroll = (e) => {
  const content = document.querySelector("#main-content");
  content.addEventListener("scroll", (event) => {
    visibleDropdown.value = false;
  });
};
</script>

<style>
.select-class button.clear-button {
  /* display: none; */
}
.select-class button.clear-button:hover {
  display: block;
}
</style>
