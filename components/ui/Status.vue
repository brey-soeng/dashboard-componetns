<template>
  <div>
    <span
      :class="[
        `uppercase font-medium  gap-2 py-[3px] align-middle  leading-[15px] tracking-[0.1em]  text-center `,
        getClass,
      ]"
    >
      {{ status.toUpperCase()?.split("_")?.join(" ") }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    default: "",
  },
  isBackground: {
    type: Boolean,
    default: false,
  },
});

const getClass = computed(() => {
  return props.isBackground
    ? `${props.status.toLowerCase()}-status-background text-white px-2  rounded-full text-[10px] font-bold`
    : `${props.status.toLowerCase()}-status`;
});
</script>

<style lang="postcss" scoped>
.active-status,
.approved-status {
  color: #0bb593;
}
.success-status {
  color: #0bb593;
}
.pending-status {
  color: #f09e00;
}

.inactive-status,
.passed-status {
  color: #6e6e73;
}
.rejected-status,
.failed-status,
.declined-status {
  color: #ef5350;
}
.schedule-status,
.scheduled-status {
  color: #0a86b0;
}
.expired-status {
  color: #ef5350;
}

.new-status {
  color: #2ac4f5;
}

.new-status-background {
  background-color: #2ac4f5;
}
.success-status-background {
  background-color: #0bb593;
}
.active-status-background,
.approved-status-background {
  background-color: #0bb593;
}

.false_alert-status-background {
  background-color: #0bbcd4;
}

.pending-status-background {
  background-color: #f09e00;
}
.inactive-status-background,
.passed-status-background,
.resolved-status-background {
  background-color: #6e6e73;
}

.inctive-status-background {
  background-color: #6e6e73;
}

.rejected-status-background,
.failed-status-background,
.declined-status-background,
.unresolved-status-background,
.true_alert-status-background {
  background-color: #ef5350;
}

.schedule-status-background,
.scheduled-status-background {
  background-color: #0a86b0;
}
.expired-status-background {
  background-color: #ef5350;
}
.passed-status-background {
  background-color: #0bb593;
}
.version-status-background {
  color: #6e6e73;
  border: 1px solid #6e6e73;
  border-radius: 20px;
}
</style>
