<template>
  <div class="mb-2">
    <slot name="label">
      <UiLabel v-if="!!label" :text="label" :required="required" />
    </slot>
    <div :class="[{ 'flex-row-reverse space-x-reverse ': small }, contentCls]">
      <div
        v-if="!uploadLoading && !modelValue"
        class="flex flex-col flex-none items-center"
        :class="widthHeightClass"
        @click="handleClick"
        @keydown="handleKeydown"
        @drop.prevent="onDrop"
        @dragover.prevent="onDragover"
        @dragleave.prevent="dragover = false"
      >
        <slot name="uploader">
          <div
            class="h-full w-full flex flex-col justify-center items-center text-center rounded-lg cursor-pointer relative text-[10px]"
            :class="[
              { 'bg-[#EFFCFE]': type !== 'document' },
              { 'border-2 border-dashed': !modelValue },
              {
                'border-red-400': isUploadFail || internalErrorMessage,
              },
            ]"
          >
            <template v-if="type === 'document'">
              <div class="py-4" v-if="!modelValue">
                <div class="w-auto flex flex-col justify-center items-center">
                  <img
                    src="@/assets/images/image-upload.svg"
                    class="w-5 h-5"
                    alt=""
                  />
                  <span
                    class="text-[#9EA2AE] font-medium text-start text-base pt-2"
                  >
                    Drag & drop file to this area or click here <br />to choose
                    and upload from your device.
                    <!-- <span class="text-primary">browse here</span> -->
                  </span>
                </div>
                <p class="px-2 text-[#9EA2AE]">
                  <slot name="upload-text"> </slot>
                </p>
              </div>
            </template>
            <template v-else>
              <div class="w-56 flex flex-col justify-center items-center pt-2">
                <img
                  src="@/assets/images/image-upload.svg"
                  class="w-5 h-5"
                  alt=""
                />
                <p class="px-2 pt-2 text-gray-light">
                  <slot name="upload-text">
                    Drag & drop file to this area or click here <br />to choose
                    and upload from your device.
                    <!-- <span class="text-primary">browse here</span> -->
                  </slot>
                </p>
              </div>
            </template>

            <img
              v-if="isAvatar && responseAsArray && modelValue.length"
              v-img-fallback
              alt=""
              class="w-full h-full object-cover absolute rounded-lg"
              :src="displayImg(modelValue[0])"
            />
            <img
              v-if="isAvatar && modelValue && !responseAsArray"
              v-img-fallback
              alt=""
              class="w-full h-full object-cover absolute rounded-lg"
              :src="displayImg(modelValue)"
            />
          </div>

          <!-- <div
            v-if="isRemove && !internalErrorMessage"
            class="items-start w-full text-error text-sm font-normal pt-2"
          >
            File upload removed
          </div> -->
        </slot>
      </div>
      <!-- new customer click remove upload -->
      <div>
        <div
          v-if="isFile && uploadLoading && progressWidth && !isUploadFail"
          class="flex justify-between items-center w-full px-3 bg-white border border-[#E9EAEF] rounded-md z-50 h-auto py-[14px]"
        >
          <div class="flex-col text-start w-10/12">
            <h3 class="font-medium text-lg text-[#081B37] leading-[16px] pb-3">
              File uploading...
            </h3>
            <div class="relative items-center">
              <div class="h-1 w-full rounded-full bg-[#E9EAEF]"></div>
              <div
                class="h-1 rounded-full bg-[#0BBCD4] absolute top-0 left-0"
                :style="`width:${progressWidth}%`"
              ></div>
            </div>
          </div>
          <div class="w-2/12 flex justify-end items-center z-40">
            <UiSvgIcon
              class="cursor-pointer text-[#9EA2AE] rounded-full z-[99999] pr-1"
              name="Close"
              size="16"
              @click="handleRemove(modelValue.id)"
            />
          </div>
        </div>
        <div
          v-else-if="
            isFile &&
            modelValue &&
            !responseAsArray &&
            !isRemove &&
            !isUploadFail
          "
          class="w-full h-auto py-3 flex px-3 justify-between items-center bg-white border border-[#50C594] rounded-md z-[1000]"
        >
          <div class="flex-none text-start">
            <h3 class="font-medium text-lg text-[#50C594]">Success</h3>
            <p
              class="font-medium text-base text-[#9EA2AE] first-letter:capitalize break-words pt-1"
            >
              {{ truncate(modelValue?.filename, 35) }}
            </p>
          </div>
          <UiSvgIcon
            class="cursor-pointer text-[#9EA2AE] rounded-full z-[99999]"
            name="Trash"
            size="28"
            @click="handleRemove(modelValue.id)"
          />
        </div>
      </div>
      <!-- end -->

      <slot name="list" :data="modelValue">
        <div class="" :style="{ maxWidth: '515px' }">
          <transition-group
            v-if="!isAvatar && !isFile"
            tag="ul"
            :class="[
              'relative flex  gap-2 ',
              { 'is-disabled': disabled },
              { 'pb-7 flex-nowrap overflow-x-auto': !small },
            ]"
            name="st-list"
          >
            <template v-if="small && modelValue.length">
              <li
                :key="modelValue[0].id"
                :class="[
                  'relative rounded-md st-transition-item flex flex-none items-center bg-gray-50',
                ]"
                tabindex="0"
                @click="modalVisibleView = true"
              >
                <UiSvgIcon
                  v-if="!small"
                  class="cursor-pointer absolute -bottom-6 right-0 text-danger rounded-full pr-2 hover:text-red-900"
                  name="Close"
                  size="23"
                  @click="handleRemove(modelValue[0].id)"
                />

                <div v-if="allowSelect" class="absolute -bottom-7 pl-2">
                  <input
                    v-model="primaryPhoto"
                    type="radio"
                    class="form-radio h-5 w-5 cursor-pointer"
                    :value="modelValue[0].id"
                    @change="onChangeSelectPrimaryPhoto($event)"
                  />
                </div>

                <template v-if="modelValue[0].mimeType === 'application/pdf'">
                  <a
                    :href="modelValue[0].path"
                    target="_blank"
                    :title="modelValue[0].title"
                    :alt="modelValue[0].title"
                  >
                    <img
                      v-img-fallback
                      class="rounded-lg object-cover border"
                      :class="widthHeightClass"
                      :src="displayImg(modelValue[0])"
                      alt=""
                    />
                  </a>
                </template>

                <img
                  v-else
                  v-img-fallback
                  class="rounded-lg object-cover border"
                  :class="widthHeightClass"
                  :src="displayImg(modelValue[0])"
                  :title="modelValue[0].title"
                  :alt="modelValue[0].title"
                />
              </li>
              <li
                v-if="modelValue.length > 1"
                key="12"
                class="w-8 h-8 flex-none"
                @click="modalVisibleView = true"
              >
                <div
                  class="flex bg-gray-200 rounded-md w-full h-full text-primary items-center justify-center"
                >
                  {{ modelValue.length - 1 }}+
                </div>
              </li>
            </template>
            <template v-else>
              <li
                v-for="image in modelValue"
                :key="image.id"
                :class="[
                  'relative rounded-md st-transition-item flex flex-none items-center bg-gray-50',
                ]"
                tabindex="0"
              >
                <!-- <UiSvgIcon
                  class="cursor-pointer absolute -bottom-6 right-0 text-danger rounded-full pr-2 hover:text-red-900"
                  name="Close"
                  size="23"
                  @click="handleRemove(image.id)"
                /> -->

                <div v-if="allowSelect" class="absolute -bottom-7 pl-2">
                  <input
                    v-model="primaryPhoto"
                    type="radio"
                    class="form-radio h-5 w-5 cursor-pointer"
                    :value="image.id"
                    @change="onChangeSelectPrimaryPhoto($event)"
                  />
                </div>

                <template v-if="image.mimeType === 'application/pdf'">
                  <a
                    :href="image.path"
                    target="_blank"
                    :title="image.title"
                    :alt="image.title"
                  >
                    <img
                      v-img-fallback
                      class="rounded-lg object-cover border"
                      :class="widthHeightClass"
                      :src="displayImg(image)"
                      alt=""
                    />
                  </a>
                </template>
                <img
                  v-else
                  v-img-fallback
                  class="rounded-lg object-cover border"
                  :class="widthHeightClass"
                  :src="displayImg(image)"
                  :title="image.title"
                  :alt="image.title"
                />
              </li>
            </template>
          </transition-group>
        </div>
      </slot>

      <input
        ref="refInput"
        type="file"
        :multiple="multiple"
        :accept="acceptType"
        @change="handleChange"
      />
    </div>
    <div v-if="errorMessage" class="text-error first-letter:uppercase mt-1">
      {{ errorMessage }}
    </div>
    <div v-if="internalErrorMessage && !uploadLoading" class="text-error mt-1">
      {{ internalErrorMessage }}
    </div>

    <UiModal
      :visible="modalVisible"
      :showClose="true"
      width="500"
      padding="p-4"
      class="relative"
      @closed="modalVisible = false"
    >
      <div class="pt-4">
        <cropper
          ref="cropper"
          class="cropper"
          :src="tempImage"
          :stencil-props="{
            aspectRatio,
          }"
          image-restriction="fit-area"
          :move-image="false"
          @change="onChangeCrop"
        ></cropper>

        <div class="flex items-end mt-3 justify-end">
          <UiButton
            :label="$t('common.cancel')"
            default-type="primary"
            @click="onCancelCrop"
          ></UiButton>
          <UiButton
            :label="$t('common.save')"
            default-type="primary"
            background
            @click="onSaveCrop"
          ></UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup>
import { Cropper } from "vue-advanced-cropper";
import { useField } from "vee-validate";
import { useAxios } from "~/utils/axios";
import { truncate } from "@/utils";
import API from "@/constants/endpoint";
import "vue-advanced-cropper/dist/style.css";
import { isValid } from "date-fns";

const emits = defineEmits(["change", "update:modelValue", "remove"]);
const props = defineProps({
  modelValue: {
    type: [String, Array, Object, Number, Boolean],
    default: () => "",
  },
  accept: {
    type: [String, Array],
    default: () => ["image/jpeg", "image/png", "image/jpg", "image/svg+xml"],
  },
  multiple: { type: Boolean, default: false },
  label: { type: String, default: null },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  limit: { type: Number, default: null },
  maxSize: { type: Number, default: 2 },
  isAvatar: { type: Boolean, default: false },
  isFile: { type: Boolean, default: false },
  onExceed: { type: Function, default() {} },
  onStart: { type: Function, default() {} },
  onProgress: { type: Function, default() {} },
  onSuccess: { type: Function, default() {} },
  onError: { type: Function, default() {} },
  beforeUpload: { type: Function, default() {} },
  onRemove: { type: Function, default() {} },
  widthHeightClass: { type: String, default: "w-28 h-28" },
  // errorMessage: { type: String, default: "" },
  allowSelect: { type: Boolean, default: false },
  allowCrop: { type: Boolean, default: false },
  responseAsArray: { type: Boolean, default: false },
  type: { type: String, default: "image" },
  small: { type: Boolean, default: false },
  aspectRatio: { type: Number, default: 1 / 1 },
  contentCls: { type: String, default: "" },
  name: {
    type: String,
    default: null,
  },
  rules: {
    type: [String, Object],
    default: null,
  },
});

const refInput = ref();
const cropper = ref();
const reqs = ref({});
const dragover = ref(false);
const modalVisible = ref(false);
const modalVisibleView = ref(false);
const tempImage = ref(null);
const tempFile = ref(null);
const internalErrorMessage = ref(null);
const isRemove = ref(false);
const progressValue = ref(0);
const uploadLoading = ref(false);
const isUploadFail = ref(false);

const { errorMessage } = useField(props.name || "name", props.rules, {
  label: props.label,
  syncVModel: true,
});

const primaryPhoto = {
  get() {
    const primaryObj =
      Array.isArray(props.modelValue) &&
      props.modelValue.find((x) => x.isPrimary);
    return primaryObj ? primaryObj.id : null;
  },
  set(value) {
    return value;
  },
};

watch(
  () => props.modelValue,
  (val) => {
    internalErrorMessage.value = null;
  }
);

const acceptType = computed(() => {
  if (props.type === "document") {
    return [
      ...props.accept,
      "application/pdf",
      "application/msword",
      "application/vnd.ms-excel",
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
  } else {
    return props.accept;
  }
});

const handleClick = () => {
  // console.log("Hello wrold");
  if (!props.disabled) {
    refInput.value.value = null;
    refInput.value.click();
  }
};

const progressWidth = computed(() => {
  return progressValue.value;
});
const handleKeydown = (e) => {
  if (e.target !== e.currentTarget) return;
  if (e.keyCode === 13 || e.keyCode === 32) {
    handleClick();
  }
};

const handleChange = (ev) => {
  const files = ev.target.files;
  if (!files) return;
  uploadFiles(files);
};

const uploadFiles = (files) => {
  if (
    !props.isAvatar &&
    props.limit &&
    props.modelValue.length + files.length > props.limit
  ) {
    internalErrorMessage.value = `File limit exceeds maximum limit ${props.limit}.`;

    props.onExceed && onExceed(files, props.modelValue);
    return;
  }
  let postFiles = Array.prototype.slice.call(files);
  if (!props.multiple) {
    postFiles = postFiles.slice(0, 1);
  }
  if (postFiles.length === 0) {
    return;
  }

  postFiles.forEach((rawFile) => {
    upload(rawFile);
  });
};

const upload = (rawFile) => {
  refInput.value.value = null;
  // console.log(rawFile, "rowfile");
  // isRemove.value = false;
  // console.log("hllo type", acceptType);
  if (acceptType.value) {
    // console.log("hllo type", acceptType);
    if (!acceptType.value.includes(rawFile.type)) {
      // internalErrorMessage.value = `File type must be ${acceptType.value.join(
      //   ", "
      // )}`;
      internalErrorMessage.value = `Only PDF, DOC, XLS, JPEG, JPG, PNG file formats are supported.`;
      return;
    }
  }

  if (props.maxSize) {
    const fileSize = rawFile.size / 1024 / 1024; // covert to M
    if (fileSize > props.maxSize) {
      internalErrorMessage.value = `File size cannot be larger than ${props.maxSize}MB`;
      return;
    }
  }

  if (props.allowCrop) {
    tempFile.value = rawFile;
    tempImage.value = URL.createObjectURL(rawFile);
    modalVisible.value = true;
    return;
  }

  if (!props.beforeUpload) {
    return props.post(rawFile);
  }

  const before = props.beforeUpload(rawFile);
  if (before && before.then) {
    before.then(
      (processedFile) => {
        const fileType = Object.prototype.toString.call(processedFile);
        if (fileType === "[object File]" || fileType === "[object Blob]") {
          if (fileType === "[object Blob]") {
            processedFile = new File([processedFile], rawFile.name, {
              type: rawFile.type,
            });
          }
          for (const p in rawFile) {
            // eslint-disable-next-line no-prototype-builtins
            if (rawFile.hasOwnProperty(p)) {
              processedFile[p] = rawFile[p];
            }
          }
          post(processedFile);
        } else {
          post(rawFile);
        }
      },
      () => {
        onRemove(null, rawFile);
      }
    );
  } else if (before !== false) {
    post(rawFile);
  } else {
    onRemove(null, rawFile);
  }
};

const abort = (file) => {
  const { reqs } = this;
  if (file) {
    let uid = file;
    if (file.uid) uid = file.uid;
    if (reqs[uid]) {
      reqs[uid].abort();
    }
  } else {
    Object.keys(reqs).forEach((uid) => {
      if (reqs[uid]) reqs[uid].abort();
      delete reqs[uid];
    });
  }
};

const post = (rawFile) => {
  const { uid } = rawFile;
  const options = {
    // headers: this.headers,
    // withCredentials: this.withCredentials,
    file: rawFile,
    // data: this.data,
    filename: rawFile.name,
    // action: this.action,
    onProgress: (e) => {
      onProgress(e, rawFile);
    },
    onSuccess: (res) => {
      delete reqs.value[uid];
      modalVisible.value = false;

      if (props.isAvatar || props.isFile) {
        const newData = {
          ...res,
          isPrimary: true,
        };
        if (props.responseAsArray) {
          emits("update:modelValue", [newData]);
          emits("change", [newData]);
        } else {
          emits("update:modelValue", newData);
          emits("change", newData);
        }
      } else {
        const newValue = [
          ...props.modelValue,
          { ...res, isPrimary: props.modelValue.length <= 0 },
        ];
        emits("update:modelValue", newValue);
        emits("change", newValue);
      }
    },
    onError: (err) => {
      // console.log("errror", err);
      internalErrorMessage.value = err;
      props.onError(err, rawFile);
      delete reqs.value[uid];
    },
  };
  const req = handleHttpRequest(options);
  reqs.value[uid] = req;
  if (req && req.then) {
    req.then(options.onSuccess, options.onError);
  }
};

const handleHttpRequest = (content) => {
  uploadLoading.value = true;
  isRemove.value = false;
  isUploadFail.value = false;

  const form = new FormData();
  form.append("file", content.file);
  form.append("AssetType", props.type);
  const config = {
    onUploadProgress: function (evt) {
      if (evt.upload) {
        const percentComplete = (evt.loaded / evt.total) * 100;
        progressValue.value = percentComplete.toFixed(0);
        // console.log("progress value", progressValue.value);
      } else {
        console.log("Total length is not known");
      }
    },
  };

  useAxios
    .post(API.postUpload, form, config, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      if (res.data.errors) {
        // content.onError("File upload failed, " + res.data.errors);
        content.onError("File upload failed");
      } else {
        content.onSuccess(res.data.data);
      }
      uploadLoading.value = false;
      progressValue.value = 0;
      isRemove.value = false;
    })
    .catch((error) => {
      if (error.data) {
        content.onError("File upload failed, " + error.data.message);
        clearRequest();
      } else if (error.request) {
        content.onError("File upload failed, no response from the server ");
        clearRequest();
      } else {
        content.onError("File upload failed, request encapsulation failed ");
        clearRequest();
      }
    });
};

const clearRequest = () => {
  uploadLoading.value = false;
  progressValue.value = 0;
  isUploadFail.value = true;
};

const handleRemove = (id) => {
  if (props.modelValue.length && props.modelValue) {
    const newValue = props.modelValue.filter((x) => x.id !== id);
    emits("update:modelValue", newValue);
    emits("change", newValue);
  } else {
    emits("update:modelValue", props.modelValue === "" || null);
    emits("change", props.modelValue === "" || null);

    // // emits("remove", props.modelValue);
    // console.log("Hello remove");
  }
  refInput.value.value = null;
  isRemove.value = true;
  uploadLoading.value = false;
  progressValue.value = 0;
  isUploadFail.value = false;
};

const onDragover = () => {
  if (!props.disabled) {
    dragover.value = true;
  }
};

const onDrop = (e) => {
  if (props.disabled) return;
  uploadFiles(e.dataTransfer.files);
};

const onChangeSelectPrimaryPhoto = (e) => {
  const newValue = props.modelValue.map((x) => {
    return {
      ...x,
      isPrimary: x.id === e.target.value,
    };
  });
  emits("update:modelValue", newValue);
  emits("change", newValue);
};

const onChangeCrop = ({ coordinates, canvas }) => {};

const onSaveCrop = () => {
  const { canvas } = cropper.value.getResult();
  canvas.toBlob((blob) => {
    const file = blobToFile(blob, tempFile.value.name);
    post(file);
  }, tempFile.value.type);
};

const blobToFile = (theBlob, fileName) => {
  return new File([theBlob], fileName, {
    lastModified: new Date().getTime(),
    type: theBlob.type,
  });
};

const onCancelCrop = () => {
  modalVisible.value = false;
  tempImage.value = null;
  tempFile.value = null;
};

const displayImg = (value) => {
  const isPdf = value.mimeType === "application/pdf";
  const isDoc = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ].includes(value.mimeType);
  if (isPdf) {
    return "/images/pdf.png";
  } else if (isDoc) {
    return "/images/doc.png";
  } else {
    return value.path;
  }
};
</script>

<style scoped lang="postcss">
::file-selector-button {
  display: none;
}
input[type="file"] {
  color: transparent;
  display: none;
}
</style>
