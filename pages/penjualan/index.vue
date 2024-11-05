<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">
      Daftar Transaksi Penjualan
    </div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div class="flex gap-4 mb-4 justify-end">
      <div class="flex mr-auto justify-between">
        <div class="w-1/5">
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" class="text-primary font-semibold"
                >Filter Tanggal</Button
              >
            </PopoverTrigger>
            <PopoverContent class="flex flex-col w-full border-primary gap-2">
              <div class="flex gap-2">
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
              </div>
              <Button class="bg-primary text-white" @click="getByDate()">
                <div v-if="filterLoading">
                  <PulseLoader
                    :color="filterLoadingColor"
                    :size="filterLoadingSize">
                  </PulseLoader>
                </div>
                <div v-else>Submit</div>
              </Button>
              <Button class="bg-secondary text-white" @click="getJualList()">
                Reset
              </Button>
            </PopoverContent>
          </Popover>
        </div>
        <div class="w-1/5">
          <xlsx-workbook>
            <xlsx-sheet :collection="dataToExport" :sheet-name="sheetName" />
            <xlsx-download :filename="fileName">
              <Button class="flex bg-primary text-white items-center gap-2">
                <FolderArrowDownIcon class="size-6"></FolderArrowDownIcon>
                Export
              </Button>
            </xlsx-download>
          </xlsx-workbook>
        </div>
      </div>
      <Input
        v-model="searchValue"
        class="w-1/2 md:w-1/5 text-xs border-black/30 focus-visible:ring-primary"
        placeholder="Cari Nomor Nota" />
    </div>
    <EasyDataTable
      :headers="headers"
      :items="jualList"
      :search-value="searchValue"
      :search-field="searchField"
      :loading="loading"
      :theme-color="color">
      <template #item-date="item" v-slot:item.date="{ item }">
        <div>{{ useFormat.dateFormat(item.date) }}</div>
      </template>
      <template #item-final_price="item" v-slot:item.final_price="{ item }">
        <div>{{ useFormat.currencyFormat(item.final_price) }}</div>
      </template>
      <template #item-actions="item" v-slot:item.actions="{ item }">
        <NuxtLink :to="/penjualan/ + item.id">
          <div class="bg-primary text-white rounded-full p-2 m-1 w-8">
            <ArrowTopRightOnSquareIcon />
          </div>
        </NuxtLink>
      </template>
    </EasyDataTable>
  </div>
</template>

<script>
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/vue/24/outline";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import {
  ArrowTopRightOnSquareIcon,
  FolderArrowDownIcon,
} from "@heroicons/vue/24/solid";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useEnvStore } from "@/stores/envStore";
import { useUseFormat } from "@/stores/useFormat";
import axios from "axios";
import {
  XlsxWorkbook,
  XlsxSheet,
  XlsxDownload,
} from "vue3-xlsx/dist/vue3-xlsx.cjs.prod";
import moment from "moment";

export default {
  setup() {
    useSeoMeta({
      title: "Penjualan | Kasirgue",
    });
    const useFormat = useUseFormat();
    return { useFormat };
  },
  components: {
    Popover,
    PopoverContent,
    PopoverTrigger,
    Input,
    Button,
    ScrollArea,
    VueDatePicker,
    PulseLoader,
    PlusIcon,
    ArrowTopRightOnSquareIcon,
    FolderArrowDownIcon,
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
  },
  data() {
    return {
      loading: true,
      filterLoading: false,
      filterLoadingColor: "#ffffff",
      filterLoadingSize: "5px",
      headers: [
        { text: "Nomor Nota", value: "nota_id", fixed: true },
        { text: "Tanggal", value: "date" },
        { text: "Total Harga", value: "final_price" },
        { text: "", value: "actions" },
      ],
      jualList: [],
      color: "#0b324f",
      searchField: "nota_id",
      searchValue: "",
      startDate: "",
      endDate: "",
      dpFormat: (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return day + "-" + month + "-" + year;
      },
      dataToExport: null,
      sheetName: "Data Penjualan",
      fileName: "Data Penjualan_" + moment().format("D-M-YYYY") + ".xlsx",
    };
  },
  methods: {
    async getJualList() {
      this.loading = true;
      try {
        const jual = await axios.get(useEnvStore().apiUrl + "/api/tx-sell");
        this.jualList = jual.data.data;
        // if data return zero
        if (this.jualList.length === 0) {
          this.dataToExport = [{ "Data Not Found": "" }];
          this.loading = false;
          return;
        }
        // if data is not zero
        this.dataToExport = jual.data.data.map((item) => ({
          "Nomor Nota": item.nota_id,
          Tanggal: useUseFormat().dateFormat(item.created_date),
          "Keterangan": item.payment_note,
          Pendapatan: useUseFormat().currencyFormat(item.final_price),
          "Biaya Admin": useUseFormat().currencyFormat(item.admin_cut),
          "Pendapatan Bersih": useUseFormat().currencyFormat(
            item.final_price - item.admin_cut
          ),
        }));
        console.log(this.dataToExport);
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async getByDate() {
      this.filterLoading = true;
      try {
        const report = await axios.post(
          useEnvStore().apiUrl + "/api/report/tx-sell/date",
          {
            startDate: this.startDate,
            endDate: this.endDate,
          }
        );
        this.jualList = report.data.data;
        this.dataToExport = report.data.data.map((item) => ({
          "Nomor Nota": item.nota_id,
          Tanggal: useUseFormat().dateFormat(item.created_date),
          "Total Harga": useUseFormat().currencyFormat(item.final_price),
        }));
        this.filterLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getJualList();
  },
};
</script>
