<template>
  <div class="inline-block w-full relative" :class="customClass">
    <table
      class="w-full table-auto"
      :class="{
        'leading-[14px]': props.isDetail,
        'leading-4': !props.isDetail,
      }"
    >
      <thead v-if="props.header && !props.isDetail">
        <tr
          :style="[
            stickyStyles,
            (scrollValue >= 10 || props.shawdowHeader >= 10) && !props.loading
              ? 'box-shadow:  0 4px 2px -2px #00000014'
              : '',
          ]"
          class="w-full"
        >
          <th
            v-if="props.showColumnIndex"
            class="font-normal text-left tracking-wider z-10 w-[50px]"
            :class="[...stickyClass, 'pl-1', headerClass, thClass]"
            :style="[stickyStyle]"
          >
            {{ $t("common.no_id") }}
          </th>
          <th
            v-for="(column, index) in props.columns"
            :key="index"
            :width="column.width ? column.width : ''"
            class="font-normal tracking-wider items-center z-10 first:pl-1 last:pr-1"
            :class="[
              ...stickyClass,

              column.labelClassName,
              headerClass,
              thClass,
              column.align ? `text-${column.align}` : 'text-left', // text-right
              {
                'rounded-tl-lg':
                  !props.showColumnIndex && index === 0 && props.rounded,
                'rounded-tr-lg':
                  !props.actionColumn &&
                  props.columns.length === index + 1 &&
                  props.rounded,
              },
            ]"
            :style="stickyStyle"
          >
            {{ column[labelField] }}
            <span v-if="column.isRequired" class="text-error">*</span>
            <div
              v-if="props.sortable && column.sortable"
              class="inline-block align-middle ml-2"
            >
              <div class="flex flex-col cursor-pointer text-gray-light">
                <UiSvgIcon
                  name="Sort"
                  size="7"
                  class="inline-block rotate-180"
                  :class="{
                    'text-primary': activeSort(column[valueField], 'asc'),
                  }"
                />
                <UiSvgIcon
                  name="Sort"
                  size="7"
                  class="inline-block"
                  :class="{
                    'text-primary': activeSort(column[valueField], 'desc'),
                  }"
                />
              </div>
            </div>
          </th>
          <th
            v-if="props.actionColumn"
            class="font-normal first-letter:uppercase text-gray-light tracking-wider z-10 pr-0"
            :class="[
              ...stickyClass,

              headerClass,
              { 'rounded-tr-lg': props.rounded },
            ]"
            :style="stickyStyle"
          >
            {{ $t("action") }}
          </th>
          <th
            v-if="props.arrowDetail"
            :class="[...stickyClass, 'text-right']"
            :style="stickyStyle"
          ></th>
        </tr>
      </thead>
      <template
        v-if="!props.loading && props.dataSource && props.dataSource.length"
      >
        <tbody>
          <tr
            v-for="(data, index) in props.dataSource"
            :key="`row-${index}`"
            :class="[
              `${stripe ? 'odd:bg-white even:bg-gray-50' : ''}`,
              {
                'bg-hover': props.showHover,
              },
              { 'bg-row-active': tableIndex === index },
              props.dataSource.length - 1 > index
                ? 'border-b border-[#E3E4E9] last:border-b-0'
                : '',
            ]"
          >
            <!--  props.isActive &&  -->
            <td
              v-if="props.showColumnIndex"
              class="text-left first:pl-0 last:pr-0"
              :class="[{ 'rounded-tl-lg': index === 0 && props.rounded }]"
            >
              <slot name="_index" :data="data"> {{ index + 1 }}</slot>
            </td>

            <td
              v-for="(column, indexTd) in props.columns"
              :key="`td-${index}-${indexTd}`"
              :class="[
                tdClass,
                'first:pl-1 last:pr-1',
                column.align ? `text-${column.align}` : '',
                column.className,
                !props.isDetail
                  ? props.paddingClass
                  : indexTd === 0
                  ? `p-0 align-top h-1 first-letter:uppercase`
                  : 'p-2 pt-3',
                {
                  'pl-0': !props.showColumnIndex && indexTd === 0,
                  'first:rounded-tl-lg last:rounded-tr-lg':
                    !props.showColumnIndex && index === 0 && props.rounded,
                  'first:rounded-bl-lg last:rounded-br-lg':
                    !props.actionColumn &&
                    props.dataSource.length === index + 1 &&
                    props.rounded,
                  'cursor-pointer': showPointer,
                  'font-medium': props.isDetail && indexTd !== 0,
                },
              ]"
              :width="column.width ? column.width : ''"
              :style="{
                minWidth: column.minWidth ? column.minWidth : 'unset',
              }"
              @click="handleRowClick(data, index)"
            >
              <slot
                :id="`slot-${index}-${indexTd}`"
                :name="column[valueField]"
                :data="data"
                :data-index="index"
              >
                <div
                  v-if="props.isDetail && indexTd === 0"
                  :class="customTableDetail"
                  :style="{ height: 'calc(100% - 0.25rem' }"
                >
                  {{ data[column[valueField]] }}
                </div>
                <span v-else class="break-words" :class="textSize">
                  {{ data[column[valueField]] }}
                </span>
              </slot>
            </td>

            <td
              v-if="props.actionColumn"
              :class="{
                'first:pl-0 last:pr-0': true,
                'rounded-br-lg': props.rounded,
              }"
            >
              <slot name="_action" :data="data" :data-index="index">
                <UiAction />
              </slot>
            </td>

            <td
              v-if="props.arrowDetail"
              class="text-left"
              :class="{ 'cursor-pointer': showPointer }"
              :width="detailWidth"
              @click="handleRowClick(data, index)"
            >
              <UiSvgIcon
                name="ArrowChevronRight"
                size="16"
                class="text-gray-light"
              />
            </td>
          </tr>

          <!-- ***** Infinite scroll  ***** -->
          <tr v-if="!props.isDetail">
            <td
              :colspan="
                props.columns.length +
                (props.showColumnIndex ? 1 : 0) +
                (props.actionColumn ? 1 : 0)
              "
            >
              <slot v-if="infinityScroll" name="infinite-scroll"> </slot>
            </td>
          </tr>
          <!-- ***** END Infinite scroll  ***** -->
        </tbody>
      </template>
    </table>
    <div
      v-if="props.loading"
      class="absolute top-1/2 w-full flex justify-center items-center text-center p-5"
      :style="{ minHeight: getMinHeightNoDataContent }"
    >
      <UiSpinner v-if="props.loading"></UiSpinner>
    </div>

    <!-- ***** No data  ***** -->
    <template v-if="!props.loading && props.dataSource.length <= 0">
      <slot name="no-data">
        <div
          class="absolute top-1/2 w-full flex h-96 xl:h-[600px] flex-col justify-center items-center text-center p-5"
        >
          <div class="m-auto w-auto">
            <slot name="no-data-img">
              <img src="@/assets/images/no-data.svg" class="m-auto" alt="" />
            </slot>
            <slot name="no-data-text">
              <p class="text-xxl font-semibold mt-4">
                {{ $t("common.no_data") }}
              </p>
              <p class="text-base text-gray-light mt-2">
                {{ $t("common.no_data_desc") }}
              </p>
            </slot>
          </div>
          <div
            class="absolute xl:-bottom-6 -bottom-8 right-[30%] w-44 h-auto xl:w-[280px]"
          >
            <img
              src="@/assets/images/arrow-emtpy.svg"
              alt=""
              class="h-full w-full"
            />
          </div>
        </div>
      </slot>
    </template>
    <!-- ***** END No data  ***** -->

    <!-- ***** Pagination  ***** -->
    <!-- <div v-if="props.pagination && props.dataSource.length">
      <st-pagination
        class="mx-4 py-3"
        :current-page="value.page"
        :per-page="value.limit"
        :total="value.total || 0"
        :go-button="false"
        @page-changed="handleChangePage"
        @perpage-changed="handleChangePerPage"
      />
    </div> -->
    <!-- ***** END Pagination  ***** -->
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
const emit = defineEmits([
  "input",
  "current-change",
  "sort-change",
  "row-click",
  "perpage-change",
]);
const props = defineProps({
  columns: { type: Array, default: () => [] },
  header: { type: Boolean, default: true },
  labelField: { type: String, default: "description" },
  valueField: { type: String, default: "column_name" },
  dataSource: { type: Array, default: () => [] },
  actionColumn: { type: Boolean, default: false },
  stripe: { type: Boolean, default: false },
  pagination: { type: Boolean, default: false },
  infinityScroll: { type: Boolean, default: false },
  sortable: { type: Boolean, default: false },
  showColumnIndex: { type: Boolean, default: false },
  maxHeight: { type: String, default: null },
  value: { type: Object, default: () => ({ page: 0, limit: 1, total: 0 }) },
  shadow: { type: Boolean, default: true },
  boxClass: { type: String, default: "" },
  isSticky: { type: Boolean, default: false },
  stickyTop: { type: String, default: "" },
  rounded: { type: Boolean, default: false },
  isDetail: { type: Boolean, default: false },
  showHover: { type: Boolean, default: true },
  paddingClass: { type: String, default: "p-3" },
  loading: { type: Boolean, default: false },
  arrowDetail: { type: Boolean, default: false },
  headerClass: {
    type: String,
    default: "text-sm leading-16px text-gray-darkn px-3 pt-3 pb-2",
  },
  stickyBackground: { type: String, default: "bg-mainBackground" },
  customTableDetail: {
    type: String,
    default: "bg-detail text-gray-dark p-2 mt-1 break-words",
  },
  isCallapTable: {
    type: Boolean,
    default: false,
  },
  textSize: {
    type: String,
    default: "text-base",
  },
  detailWidth: {
    type: String,
    default: "35px",
  },
  thClass: {
    type: String,
    default: "first-letter:capitalize",
  },
  tdClass: {
    type: String,
    default: "text-[#081B37]",
  },
  shawdowHeader: {
    type: [String, Number, Boolean],
    default: 0,
  },
  minNodataHeight: {
    type: [String, Number],
    default: 180,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: "h-auto",
  },
});
const busy = ref(true);
const sortColumn = ref({});
const scrollValue = ref(0);
const tableIndex = ref();
const activeSort = computed(() => {
  return (columnName, order) => {
    if (!sortColumn.value) return false;
    return (
      sortColumn.value.column_name === columnName &&
      sortColumn.value.order === order
    );
  };
});

const stickyClass = computed(() => {
  return [
    {
      sticky: props.isSticky,
    },
    `top-[${props.stickyTop}] ${props.stickyBackground} `,
  ];
});
const stickyStyle = computed(() => {
  return props.isSticky
    ? {
        top: props.stickyTop,
      }
    : {};
});
const showPointer = computed(() => {
  return props.showHover && !props.isDetail;
});

onMounted(() => {
  // document
  //   .querySelector("#main-content")
  //   .scrollTo({ top: 0, behavior: "smooth" });
  handleScroll();
});

const getMinHeightNoDataContent = computed(() => {
  return `calc(100vh - ${props.minNodataHeight}px)`;
});

const infiniteHandler = ($state) => {
  busy.value = true;
  console.log("Scroll");
};
const handleChangePage = (page) => {
  emit("input", {
    ...props.value,
    page,
  });
  emit("current-change", page);
};

const handleClickSort = (event, column, order) => {
  if (activeSort.value(column.column_name, order)) {
    sortColumn.value = {};
  } else {
    sortColumn.value = {
      column_name: column.column_name,
      order,
    };
  }
  emit("sort-change", sortColumn.value);
};
const handleRowClick = (data, index) => {
  tableIndex.value = index;
  emit("row-click", data);
};
const handleChangePerPage = (limit) => {
  emit("input", {
    ...props.value,
    page: 1,
    limit,
  });
  emit("perpage-change", limit);
};
const stickyStyles = computed(() => {
  if (props.isSticky) {
    return `position:sticky; top:${props.stickyTop}`;
  }
});
const handleScroll = (e) => {
  const content = document.querySelector("#main-content");
  content.addEventListener("scroll", (event) => {
    const { scrollTop } = event.target;
    scrollValue.value = scrollTop;
    // console.log(scrollTop);
  });
};
</script>

<style lang="scss" scoped>
.bg-hover:hover {
  background: linear-gradient(
    270deg,
    #f3f3f6 0.01%,
    #e3e4e9 49.48%,
    #f3f3f6 100%
  );
}
.bg-row-active {
  background: linear-gradient(
    270deg,
    #f3f3f6 0.01%,
    #e3e4e9 49.48%,
    #f3f3f6 100%
  );
}
</style>
