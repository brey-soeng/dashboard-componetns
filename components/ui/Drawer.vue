<template>
  <div class="relative" ref="elDrawer">
    <transition name="overlay-transition">
      <div
        v-if="visible"
        class="fixed top-0 left-0 w-screen h-screen bg-[#081B37] bg-opacity-60 z-50"
        @click="handleOutside"
      ></div>
    </transition>
    <transition
      name="content-transition"
      :enter-from-class="`content-transition-enter-from-${align}`"
      :leave-to-class="`content-transition-leave-to-${align}`"
    >
      <div
        v-if="visible"
        class="h-full w-full fixed bg-white z-50"
        :class="popupClass"
        :style="drawerStyle"
      >
        <div ref="elHeader">
          <div
            v-if="header"
            class="sticky flex justify-between items-start top-0 bg-white z-30 px-6 text-[#081B37]"
            :class="[{ 'pb-12': showStatus }, props.customHeader]"
            :style="
              topScroll >= 13 ? 'box-shadow: 0px 1px 4px 0px #00000014' : ''
            "
          >
            <slot name="title">
              <div class="flex flex-col justify-start">
                <h1
                  v-if="title && !props.loading"
                  class="font-semibold text-[26px] leading-[26px] first-letter:uppercase pr-2 text-[#081B37]"
                >
                  {{ title }}
                </h1>
                <UiStatus
                  v-if="props.status && !props.loading && props.isStatus"
                  :isBackground="isBackground"
                  :status="status"
                  class="mt-2"
                />
              </div>
            </slot>
            <div class="flex justify-end items-center space-x-4">
              <slot name="editable">
                <UiSvgIcon
                  v-if="isEditable"
                  :name="icon"
                  :size="size"
                  class="text-primary cursor-pointer hover:text-active"
                  @click="handleEditable"
                />
              </slot>
              <button
                v-if="closeable"
                type="button"
                class="hover:bg-[#F3F7FA] text-[#0BBCD4] w-[24px] h-[24px] rounded text-sm ml-auto cursor-pointer flex justify-center items-center"
                data-modal-toggle="popup-modal"
                @click="handleClose"
              >
                <UiSvgIcon name="Close" size="10" />
              </button>
            </div>
          </div>
        </div>
        <div
          @scroll="handleScroll"
          id="drawerID"
          class="h-full px-6 overflow-y-auto overflow-x-hidden bg-white scrollbar-gatter pt-2 pb-4"
          :style="[{ maxHeight: getMaxHeightContent }]"
          ref="eleBody"
        >
          <div ref="el">
            <slot></slot>
            <slot name="body-absolute"></slot>
          </div>
        </div>

        <div v-if="footer" class="sticky bottom-0 px-6 py-6 bg-white z-50">
          footer
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import useElementSize from "~/utils/elementResize";

const emits = defineEmits([
  "opened",
  "closed",
  "onEdited",
  "onSubmit",
  "when-scroll",
]);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [String, Number],
    default: "335",
  },
  title: {
    type: String,
    default: "",
  },
  closeable: {
    type: Boolean,
    default: true,
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "Pen",
  },
  header: {
    type: Boolean,
    default: true,
  },
  footer: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: "18",
  },
  closeOnOutside: {
    type: Boolean,
    default: true,
  },
  align: {
    type: String,
    default: "right",
    validator(value) {
      return ["left", "up", "right", "down"].includes(value);
    },
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
  overflow: {
    type: Boolean,
    default: true,
  },
  customHeader: {
    type: String,
    default: "py-6",
  },
  isBackground: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isStatus: {
    type: Boolean,
    default: false,
  },
  maxHight: {
    type: [String, Number],
    default: 150,
  },
  isShadowHeader: {
    type: Boolean,
    default: false,
  },
  isCustomShadow: {
    type: Boolean,
    default: false,
  },
});

const topScroll = ref(0);
const elDrawer = ref();
const el = ref(null);
const eleBody = ref();
const elHeader = ref();
const showShadow = ref(false);
const { height } = useElementSize(el);
const { height: heightTitle } = useElementSize(elHeader);

const drawerStyle = computed(() => {
  return { width: props.width + "px" };
});

const popupClass = computed(() => {
  return {
    "top-0 left-0": props.align === "top" || props.align === "left",
    "bottom-0 left-0": props.align === "bottom",
    "top-0 right-0": props.align === "right",
    "overflow-hidden overflow-y-hidden": props.overflow,
  };
});

const getMaxHeightContent = computed(() => {
  const eleAbsolute = elDrawer.value.getElementsByClassName("foot-absolute");
  let footerHeight = 0;
  if (eleAbsolute.length) {
    footerHeight = eleAbsolute[0].getBoundingClientRect().height;
  }
  return `calc(100vh - ${(heightTitle.value || 0) + (footerHeight || 0)}px)`;
});

watch(
  () => props.visible,
  (val) => {
    if (val) {
      topScroll.value = 0;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }
);

watch(
  () => height.value,
  () => {
    checkBodyHeight();
  }
);

const handleScroll = (e) => {
  const { scrollTop } = e.target;
  if (props.isShadowHeader) {
    topScroll.value = scrollTop;
  } else if (props.isCustomShadow) {
    emits("when-scroll", scrollTop);
  } else {
    topScroll.value = props.top;
  }
};

const afterEnter = () => {
  emits("opened");
};
const afterLeave = () => {
  emits("closed");
};

const handleClose = () => {
  emits("closed");
};
const handleOutside = (evt) => {
  if (props.closeOnOutside) {
    emits("closed");
  }
};
const handleEditable = () => {
  emits("onEdited");
};
const handleSubmit = () => {
  emits("onSubmit");
};

const checkBodyHeight = () => {
  const targetScrollHeight = eleBody.value.scrollHeight;
  const targetEleHeight = eleBody.value.clientHeight;
  const eleAbsolute = elDrawer.value.getElementsByClassName("foot-absolute")[0];
  if (!eleAbsolute) return;

  if (targetScrollHeight > targetEleHeight) {
    showShadow.value = true;
    eleAbsolute.classList.add("box-shadow-footer");
  } else {
    showShadow.value = false;
    eleAbsolute.classList.remove("box-shadow-footer");
  }
};
</script>

<style lang="scss" scope>
.content-transition-enter-from-left,
.content-transition-leave-to-left {
  transform: translateX(-100%);
}
.content-transition-enter-from-right,
.content-transition-leave-to-right {
  transform: translateX(100%);
}

.content-transition-enter-from-bottom,
.content-transition-leave-to-bottom {
  transform: translateY(100%);
}
.content-transition-enter-from-top,
.content-transition-leave-to-top {
  transform: translateY(-100%);
}
.overlay-transition-enter-from,
.overlay-transition-leave-to {
  opacity: 0;
}
.content-transition-enter-active,
.content-transition-leave-active,
.overlay-transition-enter-active,
.overlay-transition-leave-active {
  transition: all 0.5s ease-in-out;
}
.box-shadow-footer {
  box-shadow: 0px 2px 8px 0px #081b3714;
}
</style>
