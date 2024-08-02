<template>
  <div>
    <UiLabel v-if="!!label" :text="label" :required="required" />
    <div class="relative items-center" v-click-outside="handleClickOutside">
      <div
        :class="[
          inputClass,
          modelValue &&
          modelValue.type !== 'ALL' &&
          modelValue.startDate &&
          modelValue.endDate
            ? 'bg-[#F3F3F6]'
            : '',
        ]"
        @click="onClickInput"
      >
        <div :class="wrapClass">
          <span
            v-if="
              modelValue &&
              modelValue.type === 'CUSTOM' &&
              modelValue.startDate &&
              modelValue.endDate
            "
          >
            {{ formatDate(modelValue.startDate) }} -
            {{ formatDate(modelValue.endDate) }}
          </span>
          <span v-else-if="modelValue">{{ modelValue.name }}</span>
          <span v-else>All</span>
        </div>
        <div class="flex justify-end items-center gap-3 relative">
          <UiSvgIcon
            name="Datepicker"
            size="24"
            class="text-gray-light -my-2 -m-2 pr-1"
          />
        </div>
      </div>
      <UiSvgIcon
        v-if="showClear"
        name="Close"
        :size="10"
        class="absolute top-1/2 -translate-y-2/4 right-7 cursor-pointer text-gray-light hover:text-gray-600 z-100"
        @click="handleClearDate"
      />
      <UiDropdown
        :show="showDropdown"
        contentCls="top-[40px] right-0"
        zindex="z-[1000]"
      >
        <div class="w-[311px] p-4">
          <p class="flex justify-between items-center">
            <span
              class="text-[20px] leading-[28px] font-semibold text-[#081B37]"
              >Period
            </span>
            <button
              @click="handleClickOutside"
              class="h-[24px] w-[24px] text-primary flex justify-center items-center"
            >
              <UiSvgIcon name="Close" :size="10" />
            </button>
          </p>
          <div class="pt-3" :class="{ 'pb-4': showCustom }">
            <template v-for="(period, index) in periodRanges" :key="index">
              <div
                v-if="period.type === 'ALL'"
                class="py-2 px-[10px] text-base text-[#081B37] border border-[#9EA2AE] border-opacity-30 rounded-3xl inline-block font-medium mr-2 mt-2 first-letter:uppercase cursor-pointer"
                :class="[
                  {
                    'bg-primary text-white border-transparent':
                      inputValue && inputValue.type === period.type,
                  },
                ]"
                @click="onClickPerriod(period)"
              >
                {{ period.name }}
              </div>
              <div
                v-else
                class="px-2 py-2 text-base text-[#081B37] border border-[#9EA2AE] border-opacity-30 rounded-3xl inline-block font-medium mr-2 mt-2 first-letter:uppercase cursor-pointer"
                :class="[
                  {
                    'bg-primary text-white border-transparent':
                      inputValue && inputValue.type === period.type,
                  },
                ]"
                @click="onClickPerriod(period)"
              >
                {{ period.name }}
              </div>
            </template>
          </div>
          <div
            v-if="inputValue && inputValue.type === 'CUSTOM' && showCustom"
            class="flex relative items-center justify-between gap-2 pt-3 pb-4 border-t -mx-4 px-4"
          >
            <UiDatePickers
              label="From"
              type="date"
              format="DD MMM YYYY"
              :max-date="checkDate || currentDate"
              :min-date="props.minDate"
              placeholder="From date"
              v-model="startDate"
              placement="left"
              :appendToBody="false"
              :clearable="false"
              @change="onChangeDate"
              :arrowPosition="arrowPosition"
              inputCls="text-base font-medium text-[#081B37]"
              :customClass="`from-date-time-${props.position}`"
            >
            </UiDatePickers>
            <UiDatePickers
              label="To"
              type="date"
              format="DD MMM YYYY"
              :max-date="currentDate"
              :min-date="startDate"
              placeholder="To date"
              v-model="endDate"
              :appendToBody="false"
              :clearable="false"
              :arrowPosition="arrowPosition"
              inputCls="text-base font-medium text-[#081B37]"
              @change="onChangeDate"
              :customClass="`to-date-time-${props.position}`"
            >
            </UiDatePickers>
          </div>
          <div
            class="flex justify-end border-t -mx-4 px-4 pt-3"
            v-if="showCustom"
          >
            <UiButton
              label="Apply"
              class="font-medium"
              defaultType="primary"
              background
              :disabled="
                (!startDate || !endDate) && inputValue?.type === 'CUSTOM'
              "
              @click="onApply"
            ></UiButton>
          </div>
        </div>
      </UiDropdown>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import {
  subDays,
  subMonths,
  startOfDay,
  endOfDay,
  startOfYear,
  subHours,
} from "date-fns";
import { formatDate } from "@/utils";

const showDropdown = ref(false);
const focus = ref(false);
const errorMessage = ref(false);
const currentDate = new Date();
const inputValue = ref({ type: "ALL" });
const startDate = ref(null);
const endDate = ref(null);
const isArrow = ref(false);
const showCustom = ref(false);
const tempValue = ref(false);
const emits = defineEmits(["update:modelValue", "change", "clear-date"]);
const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: () => ({ type: "ALL" }),
  },
  label: {
    type: String,
    default: "",
  },
  labelClass: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: "left",
  },
  name: {
    type: String,
    default: null,
  },
  rules: {
    type: [String, Object],
    default: null,
  },
  contentClass: {
    type: [String, Object, Array],
    default: "",
  },
  inputPadding: { type: String, default: "pl-3 pr-2 py-2" },
  inputCls: { type: String, default: "" },
  focusColorBorder: {
    type: String,
    default: "border-[#0BBCD4]",
  },
  excludeAll: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  isBackground: {
    type: Boolean,
    default: false,
  },

  minDate: {
    type: Date,
    default: null,
  },
  maxDate: {
    type: Date,
    default: null,
  },
  arrowPosition: {
    type: String,
    default: "left-[254px] top-[190px]",
  },

  periodRange: {
    type: Array,
    default() {
      return [
        {
          startDate: subHours(new Date(), 24),
          endDate: endOfDay(new Date()),
          name: "last 24 hours",
          type: "24HOURS",
        },
        // {
        //   startDate: startOfDay(new Date()),
        //   endDate: endOfDay(new Date()),
        //   name: "Today",
        //   type: "TODAY",
        // },
        {
          startDate: startOfDay(subDays(new Date(), 7)),
          endDate: endOfDay(new Date()),
          name: "Last 7 days",
          type: "LAST_7_DAYS",
        },
        {
          startDate: startOfDay(subDays(new Date(), 30)),
          endDate: endOfDay(new Date()),
          name: "Last 30 days",
          type: "LAST_30_DAYS",
        },
        {
          startDate: startOfDay(subMonths(new Date(), 3)),
          endDate: endOfDay(new Date()),
          name: "Last 3 months",
          type: "LAST_3_MONTHS",
        },
        {
          startDate: startOfDay(subMonths(new Date(), 6)),
          endDate: endOfDay(new Date()),
          name: "Last 6 months",
          type: "LAST_6_MONTHS",
        },
        {
          name: "Custom range",
          type: "CUSTOM",
          startDate: null,
          endDate: null,
        },
      ];
    },
  },
  wrapClass: {
    type: String,
    default: "text-base text-[#081B37] font-normal first-letter:capitalize",
  },
  isDataLength: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  handleScroll();
});

watch(
  () => props.modelValue,
  (value) => {
    inputValue.value = value;
  },
  { immediate: true }
);

const showClear = computed(() => {
  return props.clearable && !props.disabled && props.modelValue && focus.value;
});

const inputClass = computed(() => {
  return [
    {
      "w-full h-8 relative flex justify-between items-center  border rounded ": true,
      "border-red-500": errorMessage.value,
    },
    {
      "bg-white":
        props.isBackground &&
        props.modelValue &&
        props.modelValue?.type !== "ALL",
    },
    focus.value
      ? "border-[#0BBCD4] bg-white"
      : "border-[#9EA2AE]  border-opacity-30",
    props.contentClass,
    props.inputPadding,
    props.disabled ? "cursor-not-allowed" : "cursor-pointer",
  ];
});

const periodAll = {
  startDate: null,
  endDate: null,
  name: "All",
  type: "ALL",
};

const checkDate = computed(() => {
  return endDate.value || startDate.value ? endDate.value : currentDate.value;
});

const checkMaxDate = computed(() => {
  return checkDate.value || currentDate.value;
});

const periodRanges = ref(props.periodRange);

onBeforeMount(() => {
  if (!props.excludeAll) {
    periodRanges.value = [periodAll, ...periodRanges.value];
  }
});

const handleClearDate = () => {
  showDropdown.value = false;
  focus.value = false;
  emits("clear-date");
};

const onClickInput = () => {
  if (props.disabled) return;
  focus.value = true;
  showDropdown.value = !showDropdown.value;
  tempValue.value = props.modelValue;
  if (
    props.modelValue?.type === "CUSTOM" &&
    props.modelValue.endDate &&
    props.modelValue.startDate
  ) {
    showCustom.value = true;
    endDate.value = endOfDay(tempValue.value.endDate);
    startDate.value = startOfDay(tempValue.value.startDate);
    // console.log(startDate.value, "start date");
  }
};

const handleClickOutside = () => {
  focus.value = false;
  showDropdown.value = false;
  isArrow.value = false;

  if (
    props.modelValue?.type === "CUSTOM" &&
    (!props.modelValue.startDate || !props.modelValue.endDate)
  ) {
    emits("update:modelValue", tempValue.value);
  }
};

const onChangeDate = () => {
  if (
    (startDate.value === null || endDate.value === null) &&
    inputValue.value.type === "CUSTOM"
  ) {
    showDropdown.value = true;
    inputValue.value = {
      ...inputValue.value,
      startDate: null,
      endDate: null,
    };
  } else {
    inputValue.value = {
      ...inputValue.value,
      startDate: startOfDay(startDate.value),
      endDate: endOfDay(endDate.value),
    };
  }
  isArrow.value = false;
};

const onClickPerriod = (period) => {
  startDate.value = null;
  endDate.value = null;

  if (period.type == "CUSTOM") {
    showCustom.value = true;
    inputValue.value = {
      ...period,
      startDate: null,
      endDate: null,
    };
    emits("update:modelValue", inputValue.value);
  } else {
    focus.value = false;
    showCustom.value = false;
    inputValue.value = period;
    emits("update:modelValue", inputValue.value);
    emits("change", inputValue.value);
    showDropdown.value = false;
  }
};

const onApply = () => {
  focus.value = false;
  if (
    (inputValue.value.startDate === null ||
      startDate.value === null ||
      inputValue.value.endDate === null ||
      endDate.value === null) &&
    inputValue.value?.type === "CUSTOM"
  ) {
    return;
  } else {
    showDropdown.value = false;
    emits("update:modelValue", inputValue.value);
    emits("change", inputValue.value);
  }
  isArrow.value = false;
};

const handleScroll = (e) => {
  const content = document.querySelector("#main-content");
  content.addEventListener("scroll", (event) => {
    showDropdown.value = false;
  });
};
</script>
<style>
.to-date-time-left .mx-datepicker-main {
  left: -441px !important;
  top: -193px !important;
  border-radius: 5px !important;
}
.from-date-time-left .mx-datepicker-main {
  left: -297px !important;
  top: -193px !important;
  border-radius: 5px !important;
}

.to-date-time-right .mx-datepicker-main {
  left: 167px !important;
  top: -194px !important;
  border-radius: 5px !important;
}

.from-date-time-right .mx-datepicker-main {
  left: 311px !important;
  top: -194px !important;
  border-radius: 5px !important;
}
.mx-icon-double-left,
.mx-icon-double-right {
  display: none !important;
}
.mx-btn-icon-left,
.mx-btn-icon-right {
  color: #0bbcd4 !important;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 0px;
}
.mx-btn-icon-left {
  position: absolute;
  left: 190px;
}

.mx-icon-left:before,
.mx-icon-right:before,
.mx-icon-double-left:before,
.mx-icon-double-right:before,
.mx-icon-double-left:after,
.mx-icon-double-right:after {
  border-width: 3px 0px 0px 3px;
  top: 0px;
}

.mx-calendar-header,
.mx-time-header {
  text-align: left !important;
}
.mx-btn {
  font-size: 20px;
  color: #081b37;
  line-height: 25px;
}
.mx-input-wrapper {
  font-size: 12px;
  color: #081b37;
  font-weight: 500;
}
.mx-calendar {
  width: 265px;
}
</style>
