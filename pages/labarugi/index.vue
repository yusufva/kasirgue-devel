<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Laba Rugi</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div class="flex w-1/2 gap-4 mb-4 items-end">
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
        console.log(totalBuyMonth);

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
        console.log(totalSellMonth);

        // add to data
        const monthData = {
          name: "Laba/Rugi Bulan " + moment().locale("id").format("MMMM"),
          totalBuy: totalBuyMonth,
          totalSell: totalSellMonth,
          diff: totalSellMonth - totalBuyMonth,
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
        // get total buy month
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

        // get total sell month
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
        console.log(totalsellWeek);

        // add to data
        const weekData = {
          name: "Laba/Rugi Minggu Ini",
          totalBuy: totalbuyWeek,
          totalSell: totalsellWeek,
          diff: totalsellWeek - totalbuyWeek,
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
        // get total buy month
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

        // get total sell month
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
        console.log(totalsellDay);

        // add to data
        const dayData = {
          name: "Laba/Rugi Hari Ini",
          totalBuy: totalbuyDay,
          totalSell: totalsellDay,
          diff: totalsellDay - totalbuyDay,
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
        console.log(totalsellCustom);
        const dayData = {
          name:
            "Laba/Rugi " +
            moment(this.startDate).format("D/MM/YYYY") +
            "-" +
            moment(this.endDate).format("D/MM/YYYY"),
          totalBuy: totalbuyCustom,
          totalSell: totalsellCustom,
          diff: totalsellCustom - totalbuyCustom,
        };
        this.dataForDefault.push(dayData);
        console.log(this.dataForDefault);
        this.loading = false;
      } catch (err) {
        if (err.response.status === 400) {
          useUseToast().invalidDate();
          this.loading = false;
        }
      }

      // add to data
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
