<template>
  <div>
    <slot name="label">
      <UiLabel
        v-if="!!label"
        :text="label"
        :required="required"
        labelClass="text-gray-dark"
      />
    </slot>
    <DatePicker
      :class="customClass"
      v-model:value="value"
      v-model:open="open"
      :value-type="type === 'time' ? 'format' : 'date'"
      :type="type"
      :input-class="`font-sp-pro-display px-3 w-full h-[32px] border placeholder:font-normal  rounded  appearance-none focus:outline-none focus:shadow-outline focus:border-primary bg-transparent ${
        errorMessage ? 'border-error' : ''
      }`"
      :format="format"
      :disabled="disabled"
      :placeholder="placeholder"
      :disabled-date="disabledDate"
      :disabled-time="disabledTime"
      :append-to-body="appendToBody"
      :range="range"
      :clearable="clearable"
      :separator="separator"
      :editable="false"
      @open="handleFocus"
      @change="handleChange"
      @calendar-change="handleChangeCalendar"
    >
      <template #header>
        <button
          class="mx-btn mx-btn-text font-semibold text-[20px] text-[#081B37]"
        >
          {{ monthYear }}
        </button>
        <span
          :class="arrowPosition"
          class="w-3 h-3 bg-white rotate-45 rounded-[2px] absolute z-[999]"
        ></span>
      </template>
      <template #icon-calendar>
        <UiSvgIcon
          v-if="showIconCalendar"
          name="Datepicker"
          size="14"
          class="text-gray-light"
        />
        <span v-else></span>
      </template>
    </DatePicker>

    <div v-if="errorMessage" class="text-error first-letter:uppercase">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { formatMonthYear } from "@/utils";
const value = ref();
const open = ref(false);
const monthYear = ref("");

const emits = defineEmits(["update:modelValue", "change", "arrow-position"]);
const props = defineProps({
  modelValue: {
    type: [String, Date, Array],
    default: "",
  },
  label: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: "Select date",
  },
  type: {
    type: String,
    default: "datetime",
  },
  format: {
    type: String,
    default: "YYYY-MM-DD hh:mm A",
  },
  required: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  minDate: {
    type: Date,
    default: null,
  },
  maxDate: {
    type: Date,
    default: null,
  },
  minTime: {
    type: String,
    default: null,
  },
  maxTime: {
    type: String,
    default: null,
  },
  intervalMinTime: {
    type: Number,
    default: 0,
  },
  appendToBody: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placement: {
    type: String,
    default: null,
  },
  range: {
    type: Boolean,
    default: false,
  },
  separator: {
    type: String,
    default: " - ",
  },
  showIconCalendar: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: "",
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  arrowPosition: {
    type: String,
    default: "left-[254px] top-[190px]",
  },
});

watch(
  () => props.modelValue,
  (value) => {
    // value.value = value;
  },
  { immediate: true }
);

onMounted(() => {
  value.value = props.modelValue;
});

const disabledDate = (date) => {
  if (props.minDate && props.maxDate) {
    return date < props.minDate || date > props.maxDate;
  } else if (props.minDate && !props.maxDate) {
    return date < props.minDate;
  } else if (!props.minDate && props.maxDate) {
    return date > props.maxDate;
  }

  return false;
};

const disabledTime = (date) => {
  if (props.minTime && props.maxTime) {
    const minTimes = props.minTime.split(":")[0];
    const maxTimes = props.maxTime.split(":")[0];
    return (
      date.getHours() < +minTimes + this.intervalMinTime || date > +maxTimes
    );
  } else if (props.minTime && !props.maxTime) {
    const minTimes = props.minTime.split(":")[0];
    return date.getHours() < +minTimes + this.intervalMinTime;
  } else if (!props.minTime && props.maxTime) {
    const maxTimes = props.maxTime.split(":")[0];
    return date.getHours() > +maxTimes;
  }

  return false;
};
const handleFocus = async () => {
  if (props.modelValue) {
    monthYear.value = formatMonthYear(props.modelValue);
  } else {
    const dateTime = new Date();
    monthYear.value = formatMonthYear(dateTime);
  }
  emits("arrow-position");
};

const handleChangeCalendar = async (data) => {
  monthYear.value = formatMonthYear(data);
};
const handleChange = (value, type) => {
  emits("update:modelValue", value);
  emits("change", value);
  if (type === "ampm") {
    open.value = false;
  }
};
</script>

<style>
.mx-datepicker {
  width: 100%;
}
/* .mx-datepicker svg {
  fill: none;
} */
.mx-table-date .today div {
  color: #0bbcd4 !important;
  /* background: #ff8498; */
  border-radius: 100%;
  border: 1px solid #0bbcd4;
}

.mx-table-date .today {
  color: #ffffff !important;
  background: white;
  border-radius: 100%;
}
.mx-calendar-content .cell div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 29px;
  width: auto;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
}
.mx-calendar-content .cell div:hover {
  border-radius: 100%;
  color: #081b37 !important;
  background-color: #dcfbff !important;
}
.mx-calendar-content .cell:hover {
  border-radius: 100%;
  color: #081b37 !important;
  background-color: white !important;
}
.mx-calendar-content .cell.active:hover {
  color: #081b37 !important;
}
.mx-calendar-content .cell.disabled div {
  background: #fff;
  color: #9ea2ae !important;
}

.mx-calendar-content .cell.disabled {
  background: #fff;
  color: #9ea2ae !important;
}

.mx-calendar-content .cell {
  padding: 2px 2px;
}

.mx-calendar-content .cell.active div {
  color: #fff !important;
  border-radius: 100%;
  background-color: #0bbcd4;
}
.mx-calendar-content .cell.active div:hover {
  color: #081b37 !important;
}
.mx-calendar-content .cell.active {
  color: #fff;
  border-radius: 100%;
  background-color: white;
}
.mx-table-date td,
.mx-table-date th {
  height: 30px;
}
.mx-btn {
  color: #081b37 !important;
  font-weight: 700 !important;
}
.mx-calendar {
  padding: 16px 16px !important;
}

.mx-calendar-content {
  height: 240px !important;
  padding: 10px 0px !important;
}

.arrow-span {
  width: 4px;
  height: 4px;
  background: red;
  z-index: 1000;
}

.mx-datepicker-header {
  border-bottom: 0px;
  position: absolute;
  top: 12px;
  left: 4px;
}

.mx-btn-current-month,
.mx-btn-current-year {
  display: none;
}
.mx-calendar-content .cell {
  font-weight: 500;
  font-size: 12px;
  color: #081b37;
  line-height: 16px;
}

.mx-table-date th {
  font-weight: 500;
  font-size: 12px;
  color: #9ea2ae;
}
.mx-table-date .cell.not-current-month {
  color: #9ea2ae;
  background-color: white;
}
.mx-datepicker-main {
  border: 0px;
  font: 14px / 1.5 "SF Pro Display";
}
</style>
