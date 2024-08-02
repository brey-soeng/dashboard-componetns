import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { useGeneralStore } from "@/stores/general";
import PERMISSIONS from "@/constants/permission";
import cloneDeep from "lodash.clonedeep";
import reduce from "lodash.reduce";
const KH_DB_TZ = "Asia/Phnom_Penh";

const dateTz = (date = new Date(), timeZone = KH_DB_TZ) => {
  return utcToZonedTime(new Date(date), timeZone);
};

export const useFormatDateTime = (
  value,
  defaultFormat = "dd MMM yyyy hh:mm a"
) => {
  if (!value || Number(value) === 0) {
    return "—";
  }

  return format(dateTz(new Date(value)), defaultFormat);
};

export const dateFormat = function (value) {
  return useFormatDateTime(value, "dd/MM/yyyy");
};

export const formatMonthYear = function (value) {
  return useFormatDateTime(value, "MMMM yyyy");
};

export const formatDate = function (value) {
  return useFormatDateTime(value, "dd MMM yyyy");
};

export const formatTime = function (value) {
  return useFormatDateTime(value, "hh:mm a");
};

export const formatDateForAPI = (value, param) => {
  if (!value || Number(value) === 0) return "—";
  return format(dateTz(new Date(value)), "yyyy-MM-dd");
};

export const formatDateTimeForAPI = (value, param) => {
  if (!value || Number(value) === 0) return "—";
  return format(dateTz(new Date(value)), "yyyy-MM-dd HH:mm:ss");
};

export const checkPermission = (permission) => {
  const generalStore = useGeneralStore();
  const { permissions } = cloneDeep(generalStore?.profile);
  // const isAdmin = role && role.toLowerCase() === "admin";

  return permissions.includes(PERMISSIONS[permission]);
};

export const generateErrorMsg = (errors = [], lang = "en") => {
  const data = {};
  return reduce(
    errors,
    (result = {}, item) => {
      const error = item.errorMessages.map((x) => {
        return x[`${lang}Message`] || x.message;
      });
      data[item.field] = error;
      return data;
    },
    {}
  );
};

export const truncate = (text, length, suffix = "...") => {
  if (text && text.length > length) {
    return text.substring(0, length) + suffix;
  } else {
    return text;
  }
};

export const truncateInsideString = (
  text,
  startLength,
  endLenght,
  suffix = "..."
) => {
  let startString = "";
  let endString = "";
  if (text && text.length > startLength) {
    startString = text.substring(0, startLength);
  }
  if (text && text.length > endLenght) {
    endString = text.substring(text.length - endLenght);
  }
  return startString + suffix + endString;
};

export const fetchWithAuthentication = (url, authToken) => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer  ${authToken}`);
  return fetch(url, { headers });
};

export const arrayBufferToBase64 = (buffer = new ArrayBuffer(8)) => {
  const dView = new Uint8Array(buffer); //Get a byte view
  const arr = Array.prototype.slice.call(dView); //Create a normal array
  const newArr = arr.map(function (item) {
    return String.fromCharCode(item); //Convert
  });
  return window.btoa(newArr.join(""));
};

export const displayProtectedImage = async (imageUrl, authToken) => {
  const response = await fetchWithAuthentication(imageUrl, authToken);
  const binaryData = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(binaryData);
  const dataUrl = `data:image/png;base64,${base64}`;
  return dataUrl;
};

export const formatNumber = (value) => {
  return value?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, "  ");
};

export const formatNumberPhone = (value) => {
  const x = value
    ? value.replace(/\D/g, "").match(/(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,4})/)
    : null;
  let number = "";
  if (value && value.length) {
    number = !x[2]
      ? x[1]
      : "+" +
        x[1] +
        " " +
        x[2] +
        (x[3] ? " " + x[3] : "") +
        (x[4] ? " " + x[4] : "");
  }
  return number;
};
