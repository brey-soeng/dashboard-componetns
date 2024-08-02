import modalMaker from "@/components/ui-custom/modalMaker.vue";
import { createApp } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
  const defaultOption = {};

  const ModalResult = {
    instance: null,
    option: {},
    show(option) {
      const _option = { ...defaultOption, ...option };

      const mountEl = document.createElement("div");
      document.body.appendChild(mountEl);

      this.instance = createApp(
        { extends: modalMaker },
        {
          // props
          ..._option,
          // events are passed as props here with on[EventName]

          // onHide() {
          //   console.log("onHdeeee");
          //   mountEl.parentNode.removeChild(mountEl);
          //   this.instance.unmount();
          //   this.instance = null;
          // },
        }
      );

      if (!this.instance) return;

      this.instance.mount(mountEl);

      this.instance.title = _option.title;
      this.instance.message = _option.message;
      this.instance.type = _option.type;
      this.instance.showClose = _option.showClose;
      this.instance.id = _option.id;

      this.instance.confirmLabel = _option.confirmLabel;
      this.instance.cancelLabel = _option.cancelLabel;
      this.instance.confirmBtnType = _option.confirmBtnType;
      this.instance.cancelBtnType = _option.cancelBtnType;
      this.instance.hideCancelBtn = _option.hideCancelBtn;
      this.instance.isOutsideClick = _option.isOutsideClick;

      // Ass close function to current instance. In case
      const handleClose = () => {
        if (typeof _option.onHide === "function") _option.onHide();
        this.instance = null;
      };

      this.instance.onConfirm = _option.onConfirm;
      this.instance.onHide = handleClose;
    },

    hide() {
      if (!this.instance) return;
      this.instance.handleHide();
    },
  };

  return {
    provide: {
      dialog: ModalResult,
    },
  };
});
