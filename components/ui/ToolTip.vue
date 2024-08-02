<template>
  <div :class="{ 'w-full': isSidebar }">
    <div
      ref="target"
      :class="[{ 'w-fit': fitContent }, targetCls]"
      @touchstart="handleMouseOver"
      @mouseenter="handleMouseOver"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
    >
      <slot />
    </div>

    <template v-if="visible">
      <Teleport to="body">
        <div
          class="tooltip-show"
          :class="[dropdownClass]"
          :style="getStyleDropdown"
          ref="dropdownRef"
        >
          <span class="absolute" :class="[arrowClass]">
            <UiSvgIcon
              name="ArrowDropdown"
              :size="props.iconSize"
              :class="props.iconClass"
            />
          </span>
          <slot name="content">
            <div
              class="px-2 first-letter:uppercase z-30 leading-[14px]"
              :class="[backgroundTip, customClass]"
            >
              <div v-if="rawContent" :html="content" />
              <div v-else>{{ content }}</div>
            </div>
          </slot>
        </div>
      </Teleport>
    </template>
  </div>
</template>

<script setup>
import { useSettingStore } from "@/stores/settings";

const settingStore = useSettingStore();

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  rawContent: {
    type: Boolean,
    default: false,
  },
  content: {
    type: [String, Number],
    default: null,
  },
  placement: {
    type: String,
    default: "bottom",
  },
  trigger: {
    type: String,
    default: "hover",
  },
  backgroundTip: {
    type: String,
    default:
      "bg-white text-black text-sm dark:bg-[#3A3A3D] dark:text-white rounded-[4px]",
  },
  arrow: {
    type: String,
    default: "top-center",
  },
  fitContent: {
    type: Boolean,
    default: false,
  },
  targetCls: {
    type: String,
    default: "",
  },
  isSidebar: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: [String, Array],
    default() {
      return ["w-auto max-w-[208px] bg-white text-[#081B37]"];
    },
  },
  leftPosition: {
    type: Number,
    default: null,
  },
  iconSize: {
    type: [String, Number],
    default: "45",
  },
  iconClass: {
    type: String,
    default: "text-white",
  },
});

const visible = ref(false);
const dropdownRef = ref();
const target = ref();
const allowPopup = ref(true);

const trRect = ref({});
const fixedParent = ref();
const newPlacement = ref();

watch(
  () => settingStore.onScrolling,
  (value) => {
    if (value && visible.value) {
      visible.value = false;
    }
  }
);

const arrowClass = computed(() => {
  return [
    "-z-10",
    {
      "-top-[18px] left-1/2 -translate-x-1/2": newPlacement.value === "bottom",
      "rotate-180 -bottom-[18px] left-1/2 -translate-x-1/2":
        newPlacement.value === "top",
      "-right-1 top-1/2 -translate-y-1/2 ": newPlacement.value === "left",
      "-left-[6px] top-1/2 -translate-y-1/2 -rotate-90":
        newPlacement.value === "right",

      // top left right
      "-bottom-[6px] left-4 -translate-x-1/2 -rotate-180":
        newPlacement.value === "top-left",
      "top-[2px] right-2 -translate-y-1/2": newPlacement.value === "top-right",

      // bottom left right
      "-top-[6px] left-4 -translate-x-1/2":
        newPlacement.value === "bottom-left",
      "-bottom-2  right-3 -translate-y-1/2":
        newPlacement.value === "bottom-right",

      //   left top bottom
      "top-3 -left-1 -translate-y-1/2": newPlacement.value === "left-top",
      "bottom-1  -left-1 -translate-y-1/2":
        newPlacement.value === "left-bottom",

      //   right top bottom
      "top-3 -right-1 -translate-y-1/2": newPlacement.value === "right-top",
      "bottom-1  -right-1 -translate-y-1/2":
        newPlacement.value === "right-bottom",
    },
  ];
});

const dropdownClass = computed(() => {
  return ["absolute  rounded-[4px]  z-50"];
});

const handleMouseOver = (e) => {
  checkOverflowContent();

  if (
    props.trigger === "hover" &&
    !visible.value &&
    !props.disabled &&
    allowPopup.value
  ) {
    visible.value = true;
    getDropdownPosition(e);
  }
};

const handleMouseLeave = (e) => {
  if (props.trigger === "hover") {
    visible.value = false;
  }
};

const handleClick = (e) => {
  checkOverflowContent();
  if (props.trigger === "click" && !props.disabled && allowPopup.value) {
    visible.value = !visible.value;
  }
};

const directions = {
  left: [-1, 0],
  right: [1, 0],
  top: [0, 1],
  bottom: [0, -1],
};

const getStyleDropdown = computed(() => {
  let offsetLeft = trRect.value.left;
  let offsetTop = trRect.value.top;
  const direction = directions[props.placement];

  const dropdown = dropdownRef.value;
  if (!dropdown) return;

  const ddRect = dropdown.getBoundingClientRect();

  // let shiftX = ddRect.width - trRect.value.width
  let shiftY = 0.5 * (ddRect.height + trRect.value.height);

  // Center of the target element
  let centerX = offsetLeft - 0.5 * (ddRect.width - trRect.value.width);
  let centerY = offsetTop + trRect.value.height - shiftY;

  // Position of the dropdown relatively to target
  let x = direction[0] * 0.5 * (ddRect.width + trRect.value.width);
  let y = direction[1] * shiftY;

  if (props.placement === "bottom") {
    centerY = centerY + 10;
  } else if (props.placement === "top") {
    centerY = centerY - 10;
  } else if (props.placement === "right") {
    centerX = centerX + 10;
  }

  let left = Math.round(centerX + x) || 0;

  if (left < 5 && ["bottom", "top"].includes(props.placement)) {
    left = 24;
    newPlacement.value = `${props.placement}-left`;
  }

  return {
    left: (props.leftPosition || left) + "px",
    top: (Math.round(centerY - y) || 0) + "px",
  };
});

const getDropdownPosition = (event) => {
  newPlacement.value = props.placement;
  const { target } = event;
  trRect.value = target.getBoundingClientRect();
  fixedParent.value = getFixedPositionParents(target);
};

const first = (array) => {
  return Array.isArray(array) && array.length > 0 ? array[0] : null;
};

const forEachParent = (startElement, callback) => {
  let element = startElement;

  while (
    callback &&
    element.parentNode &&
    element.parentNode.tagName !== "BODY"
  ) {
    callback(element);
    element = element.parentNode;
  }
};

const getFixedPositionParents = (element) => {
  let fixed = [];

  forEachParent(element, (node) => {
    const position = window.getComputedStyle(node).position;

    if (position === "fixed") {
      fixed.push(node);
    }
  });

  return fixed;
};

const checkOverflowContent = () => {
  if (!props.isSidebar) return;

  const targetScrollWidth = target.value.scrollWidth;
  const targetWidth = target.value.clientWidth;

  if (targetScrollWidth > targetWidth) {
    allowPopup.value = true;
  } else {
    allowPopup.value = false;
  }
};
</script>
<style scoped>
.tooltip-show {
  filter: drop-shadow(0px 4px 12px rgba(8, 27, 55, 0.1)) !important;
}
</style>
