import currencyjs from "currency.js";
import isEmpty from "lodash.isempty";

export const currencyFormatSymbol = (data) => {
  if (isEmpty(data)) {
    return currencyjs(0, { precision: 2 }).format(true);
  }

  const { value = 0, currency = "USD", symbol = "$" } = data;

  switch (currency?.toLowerCase()) {
    case "usd":
      return currencyjs(value, { precision: 2, symbol: symbol }).format(true);
    case "khr":
      return currencyjs(value, {
        precision: 0,
        symbol: symbol === "" ? "" : "៛",
        // pattern: `# !`,
      }).format(true);
    default:
      break;
  }
};

export const currencyFormatterSymbol = (data) => {
  const { value = 0, currency = "USD" } = data;
  const val = (value / 1).toFixed(2).replace(",", ".");
  switch (currency?.toLowerCase()) {
    case "usd":
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + "USD";
    case "khr":
      return "៛" + " " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    default:
      break;
  }
};

export const currencyFormatter = (data) => {
  const { value = 0, currency = "USD" } = data;
  const val = (value / 1).toFixed(2).replace(",", ".");
  switch (currency?.toLowerCase()) {
    case "usd":
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + "USD";
    case "khr":
      return currencyFormatSymbol({ ...data, symbol: "" }) + " " + "KHR";
    default:
      break;
  }
};

export const currencyFormatKMT = (data) => {
  console.log(data);
  const { value, currency } = data;
  const number = parseInt(value);
  console.log("number", number);
  const lastNumber = parseFloat(value).toFixed(2).replace(",", ".");
  console.log(lastNumber);
  const lastPoint = lastNumber.toString().split(".")[1];
  const n = number?.toString().length;
  if (n < 4) {
    return currency.toLowerCase() === "usd" ? "$ " + number : number + " KHR";
  } else if (n < 7) {
    if (Number(lastPoint) !== 0) {
      return currency.toLowerCase() === "usd"
        ? "$ " + Math.floor(number / 1000) + "" + `.${Number(lastPoint)}` + "K"
        : Math.floor(number / 1000) + "" + `.${Number(lastPoint)}` + "K KHR";
    } else {
      return currency.toLowerCase() === "usd"
        ? "$ " + Math.floor(number / 1000) + "K"
        : Math.floor(number / 1000) + "K KHR";
    }
  } else if (n < 10) {
    if (Number(lastPoint) !== 0) {
      return currency.toLowerCase() === "usd"
        ? "$ " +
            Math.floor(number / 1000000) +
            "" +
            `.${Number(lastPoint)}` +
            "M"
        : Math.floor(number / 1000000) + "" + `.${Number(lastPoint)}` + "M KHR";
    } else {
      return currency.toLowerCase() === "usd"
        ? "$ " + Math.floor(number / 1000000) + "M"
        : Math.floor(number / 1000000) + "M KHR";
    }
  } else if (n < 13) {
    if (Number(lastPoint) !== 0) {
      return currency.toLowerCase() === "usd"
        ? "$ " +
            Math.floor(number / 1000000000) +
            "" +
            `.${Number(lastPoint)}` +
            "B"
        : Math.floor(number / 1000000000) +
            "" +
            `.${Number(lastPoint)}` +
            "B KHR";
    } else {
      return currency.toLowerCase() === "usd"
        ? "$ " + Math.floor(number / 1000000000) + "B"
        : Math.floor(number / 1000000000) + "B KHR";
    }
  } else {
    if (Number(lastPoint) !== 0) {
      return currency.toLowerCase() === "usd"
        ? "$ " +
            Math.floor(number / 1000000000000) +
            "" +
            `.${Number(lastPoint)}` +
            "T"
        : Math.floor(number / 1000000000000) +
            "" +
            `.${Number(lastPoint)}` +
            "T KHR";
    } else {
      return currency.toLowerCase() === "usd"
        ? "$ " + Math.floor(number / 1000000000000) + "T"
        : Math.floor(number / 1000000000000) + "T KHR";
    }
  }
};
