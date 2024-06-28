<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">
      Welcome, {{ userName }}!
    </div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div class="flex w-full h-full gap-4 items-end">
      <!-- stock warn table -->
      <div class="flex flex-col w-1/3 h-max bg-primary p-4">
        <div class="mx-auto text-white font-semibold">Stok Hampir Habis</div>
        <ScrollArea class="h-80 w-full border-b-2 border-b-white/20">
          <Table>
            <TableHeader class="text-white bg-primary">
              <TableRow>
                <TableHead>Barang</TableHead>
                <TableHead>Stok</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="item in stok"
                :key="item.index"
                class="border-b text-white border-black/10">
                <TableCell class="font-normal capitalize">
                  {{ item.product.name }}
                </TableCell>
                <TableCell>{{ item.quantity }} {{ item.satuan }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div class="w-2/3">
        <ChartLegend class="text-sm" :legend-values="legendValues" />
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script>
import { Line } from "vue-chartjs";
import ChartLegend from "~/components/chart-legend.vue";
import { useAuthStore } from "@/stores/authStore";
import { useEnvStore } from "@/stores/envStore";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
export default {
  components: {
    Line,
    ChartLegend,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    ScrollArea,
  },
  data() {
    return {
      userName: useAuthStore().name,
      stok: [],
      chartData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            backgroundColor: "#F18200",
            data: [40, 39, 10, 40, 39, 80, 40],
            tension: 0.3,
            pointRadius: 0,
          },
        ],
      },
      chartOptions: {
        interaction: {
          intersect: false,
        },
        borderColor: "#0B324F",
        backgroundColor: "#0B324F",
      },
      legendValues: [
        {
          label: "Data One",
          color: "#F18200",
        },
      ],
    };
  },
  methods: {
    async getStokWarn() {
      try {
        const stok = await axios.get(useEnvStore().apiUrl + "/api/stock");
        const filteredData = stok.data.data.filter(
          (item) => item.quantity < 10
        );
        this.stok = filteredData;
        this.loading = false;
        console.log(stok);
      } catch (err) {
        console.log(err);
      }
    },
    async getReportData() {
      try {
        const report = await axios.get(
          useEnvStore().apiUrl + "/api/report/tx-sell/date",
          {
            startDate: "2024-06-28",
            endDate: "2024-06-21",
          }
        );
        console.log(report);
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getStokWarn();
    this.getReportData();
  },
};
</script>
