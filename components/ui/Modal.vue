<template>
  <div>
    <transition
      :name="transition"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
    >
      <div
        v-if="visible"
        class="fixed top-0 left-0 w-full h-screen bg-[#081B37] bg-opacity-60"
        :class="props.zIndex"
        @click="handleOutside"
      ></div>
    </transition>
    <transition
      :name="transition"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
    >
      <div
        v-if="visible"
        :id="id"
        ref="elDialog"
        :visible="visible"
        class="ref-modal overflow-y-auto bg-blend-darken overflow-x-hidden fixed right-0 left-0 top-0 justify-center items-center h-modal h-full flex"
        :class="props.zIndex"
        :role="role"
      >
        <div
          v-click-outside="handleOutside"
          class="relative h-auto bg-white rounded"
          :class="[props.zIndex]"
          ref="contentRef"
        >
          <!-- Modal content -->
          <div
            class="rounded shadow el-transition ease-in-out"
            :class="[customClass, padding]"
            :style="[style]"
          >
            <!-- Modal header -->
            <div
              class="flex items-start justify-between min-h-[14px]"
              ref="elHeader"
            >
              <div class="w-full">
                <slot name="title">
                  <h3
                    v-if="props.title"
                    :class="customTitle"
                    class="font-semibold text-[26px] leading-[26px] mb-6 text-[#081B37]"
                  >
                    {{ props.title }}
                  </h3>
                </slot>
              </div>
              <div class="w-12">
                <slot name="close">
                  <button
                    v-if="showClose"
                    type="button"
                    class="absolute right-6 bg-transparent rounded text-sm inline-flex items-center"
                    data-modal-toggle="popup-modal"
                    @click="handleClose"
                    :class="closeColor"
                  >
                    <UiSvgIcon name="Close" :size="closeSize" />
                  </button>
                </slot>
              </div>
            </div>
            <!-- Modal body -->
            <div :class="[textCenter]" ref="elBody" class="bg-white h-auto">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import useElementSize from "~/utils/elementResize";
const emits = defineEmits(["closed", "update:visible"]);
const props = defineProps({
  id: {
    type: String,
    default: "popup-modal",
  },
  title: {
    type: String,
    default: "",
  },
  textCenter: {
    type: String,
    default: "",
  },
  isOutsideClick: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  transition: {
    type: String,
    default: "fade",
  },
  role: {
    type: String,
    default: "dialog",
  },
  width: {
    type: String,
    default: "335",
  },
  maxHeight: {
    type: [Number, String],
    default: "",
  },
  customClass: {
    type: String,
    default: "bg-white",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  padding: {
    type: String,
    default: "p-6",
  },
  closeColor: {
    type: String,
    default: "text-[#081B37]",
  },
  zIndex: {
    type: String,
    default: "z-[100]",
  },
  closeSize: {
    type: [String, Number],
    default: "14",
  },
  customTitle: {
    type: String,
    default: "capitalize",
  },
});

const closed = ref(false);
const contentRef = ref();
const elBody = ref();
const elHeader = ref();
const dialogHeight = ref(0);
const { height } = useElementSize(elBody);
const { height: headerHight } = useElementSize(elHeader);
const style = computed(() => {
  let style = {
    width: props.width + "px",
  };

  if (props.maxHeight) {
    style = {
      ...style,
      "min-height": dialogHeight.value + "px",
      // "max-height": props.maxHeight + "px",
    };
  }
  return style;
});

watch(
  () => height.value,
  (newVal) => {
    dialogHeight.value = newVal + headerHight.value;
  }
);

const handleOutside = () => {
  if (props.isOutsideClick) {
    return;
  }
  emits("closed");
};

const handleClose = () => {
  emits("update:visible", true);
  emits("closed");
};
const afterEnter = () => {
  // emits('close')
};
const afterLeave = () => {
  // emits('close')
};
</script>

<style scoped>
.el-transition {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 50ms;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

/* .fade-enter-active,
  .bounce-enter-active {
    animation: bounce-in 0.5s ease-out both;
  }
  
  .bounce-leave-active {
    animation: bounce-in 0.5s reverse ease-in both;
  } */
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* slide-fade */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.animate-y.enter {
  transform: translateY(100px);
}

.animate-y.leave {
  transform: translateY(0px);
}
</style>
