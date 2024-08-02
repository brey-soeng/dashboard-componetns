<template>
  <div>
    <div
      class="flex items-center justify-between w-full cursor-pointer py-2"
      :class="[
        props.isBorder ? 'border-b border-gray-100' : '',
        props.headerClass,
      ]"
      @click="isActive = !isActive"
    >
      <slot name="header">
        <div
          class="flex items-center space-x-2"
          :class="[
            props.isBorder ? 'capitalize' : 'uppercase',
            props.colorTitle,
          ]"
        >
          <span>{{ props.title }}</span>
        </div>
        <div class="flex">
          <UiSvgIcon
            v-if="props.showEdit && isActive"
            name="pen"
            size="16"
            class="text-primary"
            @click.stop="$emit('on-click-edit')"
          />
          <UiSvgIcon
            v-else-if="props.suffixIcon && isActive"
            :name="props.suffixIcon"
            :size="props.suffixIconSize"
            class="text-gray-light"
          />

          <UiSvgIcon
            v-else
            :name="props.reverseSuffixIcon"
            :size="props.suffixIconSize"
            class="text-gray-light"
            :class="{ 'rotate-180': isActive }"
          />
        </div>
      </slot>
    </div>

    <div v-if="isActive">
      <div class="">
        <slot name="content"> </slot>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: false,
  },
  suffixIcon: {
    type: String,
    default: "ChevronDown",
  },
  reverseSuffixIcon: {
    type: String,
    default: "ChevronUp",
  },
  suffixIconSize: {
    type: String,
    default: "16",
  },
  isBorder: {
    type: Boolean,
    default: false,
  },
  showEdit: {
    type: Boolean,
    default: false,
  },
  headerClass: {
    type: String,
    default:
      "py-1 text-base font-medium leading-[14px] bg-[#F0F1F3] px-2 rounded-md",
  },
  colorTitle: {
    type: String,
    default: "text-gray-light",
  },
});
const isActive = ref(props.active);
const handleClickEdit = () => {
  console.log("click");
};
</script>
