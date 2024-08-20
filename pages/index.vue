<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-xl md:text-2xl">
      Welcome, {{ userName }}!
    </div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div class="flex flex-col md:flex-row w-full h-full gap-4 items-start">
      <!-- stock warn table -->
      <div
        class="flex flex-col w-full md:w-1/3 h-[70vh] md:h-[25rem] 2xl:h-[37rem] bg-primary p-4 overflow-y-scroll scrollbar-hide"
      >
        <div class="mx-auto text-white font-semibold text-xl">
          Stok Hampir Habis
        </div>
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
              class="border-b text-white border-black/10"
            >
              <TableCell class="font-normal capitalize">
                {{ item.product.name }}
              </TableCell>
              <TableCell>{{ item.quantity }} {{ item.satuan }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="w-full md:w-2/3">
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
import { useUseFormat } from "@/stores/useFormat";
import moment from "moment";
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
        labels: [],
        datasets: [],
      },
      chartOptions: {
        interaction: {
          intersect: false,
        },
        scales: {
          y: {
            ticks: {
              callback: (value, index, values) => {
                return useUseFormat().currencyFormat(value);
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";

                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += useUseFormat().currencyFormat(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
        borderColor: "#0B324F",
        backgroundColor: "#0B324F",
      },
      legendValues: [
        {
          label: "Penjualan",
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
      } catch (err) {
        console.log(err);
      }
    },
    async getReportData() {
      try {
        const report = await axios.post(
          useEnvStore().apiUrl + "/api/report/tx-sell/date",
          {
            startDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"),
          }
        );
        console.log(report);

        // Step 1: Group by created_date
        const groupedByDate = report.data.data.reduce((acc, transaction) => {
          const date = transaction.created_date.split("T")[0]; // Extract the date part from created_date
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(transaction);
          return acc;
        }, {});
        console.log(groupedByDate);

        // Step 2: Sum the final_price for each group
        const summedByDate = Object.keys(groupedByDate).map((date) => {
          const transactions = groupedByDate[date];
          const totalFinalPrice = transactions.reduce(
            (sum, transaction) => sum + transaction.final_price,
            0
          );
          return {
            date,
            totalFinalPrice,
          };
        });
        console.log(summedByDate);
        const labelChart = summedByDate.map((item) =>
          useUseFormat().chartDateFormat(item.date)
        );
        const dataChart = summedByDate.map((item) => item.totalFinalPrice);
        this.chartData = {
          labels: labelChart,
          datasets: [
            {
              backgroundColor: "#F18200",
              data: dataChart,
              tension: 0.3,
              pointRadius: 0,
            },
          ],
        };
        console.log(this.chartData);
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

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
