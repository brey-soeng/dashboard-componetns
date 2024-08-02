<template>
  <div v-click-outside="handleClickOutside" class="relative">
    <UiSvgIcon
      name="More"
      size="15"
      @click="visible = !visible"
      class="cursor-pointer m-auto text-[#9B9B9B] hover:text-primary z-10"
    />
    <div
      v-if="visible"
      class="absolute right-0 border bg-white rounded z-20"
      :style="{ minWidth: '150px' }"
    >
      <slot name="content">
        <ul class="divide-y text-center">
          <li class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
            {{ $t("view") }}
          </li>
          <li class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
            {{ $t("edit") }}
          </li>
          <li class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-error">
            {{ $t("delete") }}
          </li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const visible = ref(false);
const handleClickOutside = () => {
  visible.value = false;
};
</script>
