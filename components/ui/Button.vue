<template>
  <div class="relative">
    <template v-if="circle">
      <button
        :class="[...getButtonClass, customClass]"
        :type="type"
        :disabled="buttonDisabled || loading"
        @click="emitClick"
      >
        <span v-if="$slots.default"><slot /></span>
        <UiSvgIcon v-if="svgIcon" :name="svgIcon" :size="size" class="m-auto" />
      </button>
      <div
        v-if="isShadow"
        class="absolute top-4 left-1/2 -translate-x-1/2 w-12 aspect-square bg-[#1B4664] opacity-40 rounded-full -z-10"
        :style="{ filter: 'blur(10px)' }"
      />
    </template>

    <button
      v-else
      :class="[
        'inline-flex items-center justify-center leading-4  text-[14px] font-medium',
        ...getButtonClass,
        { 'shadow-lg': isShadow },
        customClass,
      ]"
      :type="type"
      :disabled="buttonDisabled || loading"
      :data-modal-toggle="dataModalToggle"
      @click="emitClick"
    >
      <UiSvgIcon
        v-if="prefixIcon && !loading"
        :name="prefixIcon"
        size="18"
        class="mr-2 w-5 h-5"
      />
      <span v-if="loading" class="flex justify-center items-center">
        <svg
          role="status"
          class="inline mr-3 w-4 h-4 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Loading...
      </span>
      <span v-if="$slots.default"><slot /></span>
      <span v-if="!loading" class="first-letter:uppercase">{{ label }}</span>

      <UiSvgIcon
        v-if="suffixIcon && !loading"
        :name="suffixIcon"
        size="18"
        class="ml-2 w-5 h-5"
      />
    </button>

    <!-- DO NOT REMOVE THIS: For tailwind included when build -->
    <!--  text-primary bg-primary border-waring bg-primary/80 border-waring/80 -->
    <!--  text-danger bg-danger border-waring bg-danger/80 border-waring/80 -->
    <!--  text-warning bg-warning border-waring bg-warning/80 border-waring/80 -->
    <!--  text-warning bg-warning border-waring bg-warning/80 border-waring/80 -->
    <!--  bg-[#BDC1CB] -->
  </div>
</template>

<script setup>
const emits = defineEmits(["click"]);
const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
  to: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  prefixIcon: {
    type: String,
    default: "",
  },
  suffixIcon: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  dataModalToggle: {
    type: String,
    default: "",
  },
  customClass: {
    type: [String, Array],
    default() {
      return ["p-2 border"];
    },
  },
  circle: {
    type: Boolean,
    default: false,
  },
  svgIcon: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "14",
  },
  isBorder: {
    type: Boolean,
    default: false,
  },
  isShadow: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "w-[140px]",
  },
  height: {
    type: String,
    default: "min-h-[38px]",
  },
  circleWidth: {
    type: String,
    default: "w-14",
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  defaultType: {
    type: String,
    default: "default",
  },
  background: {
    type: Boolean,
    default: false,
  },
});

const disableBg = "[#BDC1CB]";

const getButtonClass = computed(() => {
  const disableClass =
    props.disabled || props.loading ? "cursor-not-allowed" : "cursor-pointer";
  const textClass = props.defaultType === "default" ? "" : "text-white";

  const fullWidth = props.fullWidth
    ? `w-full ${props.height}`
    : `${props.width} ${props.height}`;

  const widthClass = props.circle
    ? props.circleWidth + " aspect-square"
    : fullWidth;

  const roundedClass =
    props.rounded || props.circle ? "rounded-full" : "rounded";

  const defaultBgClass =
    props.defaultType === "default"
      ? "border rounded"
      : `border-0 border-transparent border-${
          props.disabled ? disableBg : props.defaultType
        } hover:border-${props.defaultType}/80 bg-${
          props.disabled ? disableBg : props.defaultType
        } ${textClass} ${roundedClass} hover:bg-${props.defaultType}/80`;

  const defaultBorderClass = ` text-${props.defaultType} ${roundedClass} hover:bg-gray-light/10`;
  const defaultClass = props.background ? defaultBgClass : defaultBorderClass;

  return [widthClass, defaultClass, disableClass];
});

const buttonDisabled = computed(() => {
  return props.disabled;
});

const emitClick = () => {
  emits("click");
};
</script>

<style lang="scss" scoped>
.bg-primary-hover {
  background-color: #00a9c0;
}
.border-primary-hover {
  border-color: #00a9c0;
}
</style>
