<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Laba Rugi</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div
      class="flex flex-col md:flex-row w-1/2 gap-4 mb-4 items-start md:items-end">
      <div class="flex flex-col w-36">
        <div class="text-xs">Tanggal Awal</div>
        <VueDatePicker
          v-model="startDate"
          auto-apply
          :format="dpFormat"
          model-type="yyyy-MM-dd"></VueDatePicker>
      </div>
      <div class="flex flex-col w-36">
        <div class="text-xs">Tanggal Akhir</div>
        <VueDatePicker
          v-model="endDate"
          auto-apply
          :format="dpFormat"
          model-type="yyyy-MM-dd"></VueDatePicker>
      </div>
      <Button class="bg-primary text-white" @click="showWithCustomDate()"
        >Lihat</Button
      >
      <xlsx-workbook>
        <xlsx-sheet :collection="dataToExport" :sheet-name="sheetName" />
        <xlsx-download :filename="fileName">
          <Button
            class="flex bg-primary text-white items-center gap-2"
            @click="setExportData()">
            <FolderArrowDownIcon class="size-6"></FolderArrowDownIcon>
            Export
          </Button>
        </xlsx-download>
      </xlsx-workbook>
    </div>
    <div v-if="default">
      <EasyDataTable
        :headers="headerForDefault"
        :items="dataForDefault"
        :loading="loading"
        :theme-color="color"
        hide-footer>
        <template #item-totalSell="item" v-slot:item.totalSell="{ item }">
          <div>
            {{ useFormat.currencyFormat(item.totalSell) }}
          </div>
        </template>
        <template #item-totalBuy="item" v-slot:item.totalBuy="{ item }">
          <div>
            {{ useFormat.currencyFormat(item.totalBuy) }}
          </div>
        </template>
        <template #item-diff="item" v-slot:item.diff="{ item }">
          <div class="font-bold" :class="setColour(item.diff)">
            {{ useFormat.currencyFormat(item.diff) }}
          </div>
        </template>
      </EasyDataTable>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment/min/moment-with-locales";
import { useUseToast } from "@/stores/useToast";
import { useEnvStore } from "@/stores/envStore";
import { useUseFormat } from "@/stores/useFormat";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { Button } from "@/components/ui/button";
import { FolderArrowDownIcon } from "@heroicons/vue/24/solid";
import {
  XlsxWorkbook,
  XlsxSheet,
  XlsxDownload,
} from "vue3-xlsx/dist/vue3-xlsx.cjs.prod";
export default {
  setup() {
    useSeoMeta({
      title: "Laba-Rugi | Kasirgue",
    });
    const useFormat = useUseFormat();
    return { useFormat };
  },
  components: {
    VueDatePicker,
    Button,
    FolderArrowDownIcon,
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
  },
  data() {
    return {
      default: true,
      loading: true,
      color: "#0b324f",
      dataForDefault: [],
      headerForDefault: [
        { text: "", value: "name" },
        { text: "Uang Masuk", value: "totalSell" },
        { text: "Uang Keluar", value: "totalBuy" },
        { text: "Laba/ Rugi", value: "diff" },
      ],
      startDate: "",
      endDate: "",
      dpFormat: (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return day + "-" + month + "-" + year;
      },
      dataToExport: null,
      sheetName: "Data LabaRugi",
      fileName: "Data LabaRugi_" + moment().format("D-M-YYYY") + ".xlsx",
    };
  },
  methods: {
    // get month data
    async getbyMonth() {
      try {
        // get total buy month
        const buyMonth = await axios.post(
          useEnvStore().apiUrl + "/api/report/tx-buy/date",
          {
            startDate: moment().startOf("month").format("YYYY-MM-D"),
            endDate: moment().format("YYYY-MM-D"),
          }
        );
        console.log(buyMonth);
        const totalBuyMonth = buyMonth.data.data.reduce(
          (sum, transaction) => sum + transaction.final_price,
          0
        );

        console.log("Buy Month: ", totalBuyMonth);

        // get total sell month
        const sellMonth = await axios.post(
          useEnvStore().apiUrl + "/api/report/tx-sell/date",
          {
            startDate: moment().startOf("month").format("YYYY-MM-D"),
            endDate: moment().format("YYYY-MM-D"),
          }
        );
        console.log(sellMonth);
        const totalSellMonth = sellMonth.data.data.reduce(
          (sum, transaction) => sum + transaction.final_price,
          0
        );
        const adminCut = sellMonth.data.data.reduce(
          (sum, transaction) => sum + transaction.admin_cut,
          0
        );
        console.log("Sell Month+Admin: ", totalSellMonth);

        // get total kas month
        const kasMonth = await axios.post(
          useEnvStore().apiUrl + "/api/report/kas-tx/date",
          {
            startDate: moment().startOf("month").format("YYYY-MM-D"),
            endDate: moment().format("YYYY-MM-D"),
          }
        );
        console.log(kasMonth);
        const totalKasMonth = kasMonth.data.data.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );
        console.log("Kas month: ", totalKasMonth);

        // add to data
        const monthData = {
          name: "Laba/Rugi Bulan " + moment().locale("id").format("MMMM"),
          totalBuy: totalBuyMonth + totalKasMonth,
          totalSell: totalSellMonth - adminCut,
          diff: totalSellMonth - totalBuyMonth - adminCut - totalKasMonth,
        };
        this.dataForDefault.push(monthData);
        console.log(this.dataForDefault);
        this.getByWeek();
      } catch (err) {
        console.log(err);
      }
    },
    // get week data
    async getByWeek() {
      try {
        // get total buy week
        const buyWeek = await axios.post(
          useEnvStore().apiUrl + "/api/report/tx-buy/date",
          {
            startDate: moment().startOf("week").format("YYYY-MM-D"),
            endDate: moment().format("YYYY-MM-D"),
          }
        );
        console.log(buyWeek);
        const totalbuyWeek = buyWeek.data.data.reduce(
          (sum, transaction) => sum + transaction.final_price,
          0
        );
        console.log(totalbuyWeek);

        // get total sell week
        const sellWeek = await axios.post(
          useEnvStore().apiUrl + "/api/report/tx-sell/date",
          {
            startDate: moment().startOf("week").format("YYYY-MM-D"),
            endDate: moment().format("YYYY-MM-D"),
          }
        );
        console.log(sellWeek);
        const totalsellWeek = sellWeek.data.data.reduce(
          (sum, transaction) => sum + transaction.final_price,
          0
        );
        const adminCut = sellWeek.data.data.reduce(
          (sum, transaction) => sum + transaction.admin_cut,
          0
        );
        console.log(totalsellWeek);

        // get total kas week
        const kasWeek = await axios.post(
          useEnvStore().apiUrl + "/api/report/kas-tx/date",
          {
            startDate: moment().startOf("week").format("YYYY-MM-D"),
            endDate: moment().format("YYYY-MM-D"),
          }
        );
        console.log(kasWeek);
        const totalkasWeek = kasWeek.data.data.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );

        // add to data
        const weekData = {
          name: "Laba/Rugi Minggu Ini",
          totalBuy: totalbuyWeek + totalkasWeek,
          totalSell: totalsellWeek - adminCut,
          diff: totalsellWeek - totalbuyWeek - adminCut - totalkasWeek,
        };
        this.dataForDefault.push(weekData);
        console.log(this.dataForDefault);
        this.getByDay();
      } catch (err) {
        console.log(err);
      }
    },
    // get day data
    async getByDay() {
      try {
        // get total buy day
        const buyDay = await axios.post(
          useEnvStore().apiUrl + "/api/report/tx-buy/date",
          {
            startDate: moment().format("YYYY-MM-D"),
            endDate: moment().format("YYYY-MM-D"),
          }
        );
        console.log(buyDay);
        const totalbuyDay = buyDay.data.data.reduce(
          (sum, transaction) => sum + transaction.final_price,
          0
        );
        console.log(totalbuyDay);

        // get total sell day
        const sellDay = await axios.post(
          useEnvStore().apiUrl + "/api/report/tx-sell/date",
          {
            startDate: moment().format("YYYY-MM-D"),
            endDate: moment().format("YYYY-MM-D"),
          }
        );
        console.log(sellDay);
        const totalsellDay = sellDay.data.data.reduce(
          (sum, transaction) => sum + transaction.final_price,
          0
        );
        const adminCut = sellDay.data.data.reduce(
          (sum, transaction) => sum + transaction.admin_cut,
          0
        );
        console.log(totalsellDay);

        // get total kas day
        const kasDay = await axios.post(
          useEnvStore().apiUrl + "/api/report/kas-tx/date",
          {
            startDate: moment().format("YYYY-MM-D"),
            endDate: moment().format("YYYY-MM-D"),
          }
        );
        console.log(kasDay);
        const totalkasDay = kasDay.data.data.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );

        // add to data
        const dayData = {
          name: "Laba/Rugi Hari Ini",
          totalBuy: totalbuyDay + totalkasDay,
          totalSell: totalsellDay - adminCut,
          diff: totalsellDay - totalbuyDay - adminCut - totalkasDay,
        };
        this.dataForDefault.push(dayData);
        console.log(this.dataForDefault);
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    // custom date data
    async showWithCustomDate() {
      this.loading = true;
      // get total buy
      try {
        const buyCustom = await axios.post(
          useEnvStore().apiUrl + "/api/report/tx-buy/date",
          {
            startDate: this.startDate,
            endDate: this.endDate,
          }
        );
        console.log(buyCustom);
        const totalbuyCustom = buyCustom.data.data.reduce(
          (sum, transaction) => sum + transaction.final_price,
          0
        );
        console.log(totalbuyCustom);

        // get total sell
        const sellCustom = await axios.post(
          useEnvStore().apiUrl + "/api/report/tx-sell/date",
          {
            startDate: this.startDate,
            endDate: this.endDate,
          }
        );
        console.log(sellCustom);
        const totalsellCustom = sellCustom.data.data.reduce(
          (sum, transaction) => sum + transaction.final_price,
          0
        );
        const adminCut = sellCustom.data.data.reduce(
          (sum, transaction) => sum + transaction.admin_cut,
          0
        );
        console.log(totalsellCustom);

        // get total kas custom
        const kasCustom = await axios.post(
          useEnvStore().apiUrl + "/api/report/kas-tx/date",
          {
            startDate: this.startDate,
            endDate: this.endDate,
          }
        );
        console.log(kasCustom);
        const totalkasCustom = kasCustom.data.data.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );

        // add to data
        const customData = {
          name:
            "Laba/Rugi " +
            moment(this.startDate).format("D/MM/YYYY") +
            "-" +
            moment(this.endDate).format("D/MM/YYYY"),
          totalBuy: totalbuyCustom + totalkasCustom,
          totalSell: totalsellCustom - adminCut,
          diff: totalsellCustom - totalbuyCustom - adminCut - totalkasCustom,
        };
        this.dataForDefault.push(customData);
        console.log(this.dataForDefault);
        this.loading = false;
      } catch (err) {
        if (err.response.status === 400) {
          useUseToast().invalidDate();
          this.loading = false;
        }
      }
    },
    setExportData() {
      this.dataToExport = this.dataForDefault.map((item) => ({
        Periode: item.name,
        "Uang Masuk": item.totalSell,
        "Uang Keluar": item.totalBuy,
        "Laba/Rugi": item.diff,
      }));
    },
    setColour(value) {
      var values = value.toString();
      if (values.at(0) === "-") {
        return "text-red";
      }
      if (values === 0) {
        return "text-black";
      } else {
        return "text-primary";
      }
    },
  },
  mounted() {
    this.getbyMonth();
  },
};
</script>

<style lang="scss" scoped></style>
