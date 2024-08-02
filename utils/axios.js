import axios from "axios";
import { useAuth } from "@/stores/auth";
import { useGeneralStore } from "@/stores/general";
import API from "@/constants/endpoint";

export const useAxios = axios.create({
  baseURL: "",
  withCredentials: false,
  headers: {},
});

// interceptors
useAxios.interceptors.request.use(
  function (config) {
    const authStore = useAuth();
    config.headers["X-Forwarded-Proto"] = "https";
    config.headers["Authorization"] = `Bearer ${authStore.access_token}`;
    config.headers['X-Forwarded-Pathname'] = window.location.pathname
    config.headers['X-Forwarded-Hostname '] = window.location.hostname
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);



useAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const authStore = useAuth();
    const generalStore = useGeneralStore();
    const services = useServices();
    const { $dialog, i18n } = useNuxtApp();

    let message = "";
    const { status, data, config } = error.response;

    switch (status) {
      case 409:
        message = data.message || data.Message;
        break;
      case 401:
        if (config.url === API.getUserProfile) {
          await authStore.clearUserSession();
          await services.$auth.logout();
        } else {
          await generalStore.getUserProfile();
        }

        break;
      case 403:
        window.location.href = "/forbidden";
        break;

      // case 404:
      case 500:
      case 501:
      case 502:
        if (!generalStore.unexpectedError) {
          generalStore.unexpectedError = true;
          $dialog.show({
            type: "fail",
            subTitle: i18n.global.t("common.failed_title"),
            message:
              i18n.global.t("common.failed_message_title") + `[${status}]`,
            onHide: () => {
              generalStore.unexpectedError = false;
            },
          });
        }
        break;
      default:
        // eslint-disable-next-line no-unused-vars
        message = "Something went wrong";
        break;
    }
    return Promise.reject(error.response);
  }
);
