import { defineStore } from "pinia";
import moment from "moment/min/moment-with-locales";

export const useUseFormat = defineStore("format", {
  actions: {
    dateFormat(date) {
      moment.locale("id");
      return moment(date).format("D MMMM YYYY [Jam] HH:mm:s");
    },
    chartDateFormat(date) {
      moment.locale("id");
      return moment(date).format("D MMMM YYYY");
    },
    receiptDateFormat(date) {
      moment.locale("id");
      return moment(date).format("D/MM/YY HH:mm:ss");
    },
    currencyFormat(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    },
  },
});
