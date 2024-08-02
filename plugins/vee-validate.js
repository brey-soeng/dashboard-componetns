import { defineRule, configure } from "vee-validate";
import AllRules from "@vee-validate/rules";
import sumBy from "lodash.sumby";
export default defineNuxtPlugin((nuxtApp) => {
  Object.keys(AllRules).forEach((rule) => {
    defineRule(rule, AllRules[rule]);
  });

  defineRule("valid_account", (value) => {
    const number = value.replace(/\s+/g, "");
    if (number.length === 9 || value === "N/A" || value === "N/A ") {
      return true;
    } else {
      return false;
    }
  });

  defineRule("valid_phone", (value) => {
    const number = value.replace(/\s+/g, "");
    if (number.length >= 8 || value === "N/A" || value === "N/A ") {
      return true;
    } else {
      return false;
    }
  });

  defineRule("custom_min_value", (value_a, data) => {
    if (value_a > data[0]) {
      return true;
    } else {
      return false;
    }
  });

  defineRule("custom_max_value", (value_a, data) => {
    if (data[0]) {
      if (value_a < data[0]) {
        return true;
      } else {
        return false;
      }
    } else {
      console.log(data[0]);
      return true;
    }
  });

  defineRule("max_value_length_field", (value, data) => {
    // console.log("leng", data);
    if (data[0] < 2) {
      return false;
    } else {
      return true;
    }
  });

  defineRule("max_value_field", (value, data) => {
    // console.log(data);
    if (data[4] && data[0] > 100 && data[2] === data[3]) {
      return false;
    } else {
      return true;
    }
  });

  defineRule("custom_not_found_field", (value, data) => {
    if (data[0] === true) {
      return false;
    } else {
      return true;
    }
  });

  defineRule("check_rule_name", (value, data) => {
    if (data && data.length) {
      return false;
    } else {
      return true;
    }
  });

  configure({
    generateMessage: (context) => {
      const { rule, field } = context;
      const i18n = nuxtApp.i18n.global;
      const params = {};
      rule.params.forEach((x, index) => {
        params[`param_${index}`] = x;
      });

      return i18n.t(`validate.${rule.name}`, {
        _field_: field,
        ...params,
      });
    },
  });
});
