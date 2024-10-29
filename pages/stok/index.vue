<template>
  <div class="flex flex-col w-full h-max gap-4">
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Daftar Stok</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
    <!-- content -->
    <div class="flex justify-between">
      <xlsx-workbook>
        <xlsx-sheet :collection="dataToExport" :sheet-name="sheetName" />
        <xlsx-download :filename="fileName">
          <Button class="flex bg-primary text-white items-center gap-2">
            <FolderArrowDownIcon class="size-6"></FolderArrowDownIcon>
            Export
          </Button>
        </xlsx-download>
      </xlsx-workbook>
      <Input class="w-1/5" placeholder="Cari Barang" v-model="searchValue" />
    </div>
    <EasyDataTable
      :headers="headers"
      :items="stok"
      :search-value="searchValue"
      :search-field="searchField"
      class="capitalize"
      :loading="loading"
      :theme-color="color">
      <template #item-quantity="item" v-slot:item.actions="{ item }">
        <div>{{ item.quantity + " (" + item.satuan.kd_satuan + ")" }}</div>
      </template>
    </EasyDataTable>
  </div>
</template>

<script>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircleIcon,
  ArrowTopRightOnSquareIcon,
  FolderArrowDownIcon,
} from "@heroicons/vue/24/solid";
import { useEnvStore } from "@/stores/envStore";
import {
  XlsxWorkbook,
  XlsxSheet,
  XlsxDownload,
} from "vue3-xlsx/dist/vue3-xlsx.cjs.prod";
import axios from "axios";
import moment from "moment";
export default {
  setup() {
    useSeoMeta({
      title: "Stok | Kasirgue",
    });
  },
  components: {
    Button,
    Input,
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
    PlusCircleIcon,
    ArrowTopRightOnSquareIcon,
    FolderArrowDownIcon,
  },
  data() {
    return {
      loading: true,
      headers: [
        { text: "Barang", value: "product.name" },
        { text: "Jumlah Stok", value: "quantity" },
      ],
      searchValue: "",
      searchField: "product.name",
      stok: [],
      color: "#0b324f",
      dataToExport: null,
      sheetName: "Daftar Stok",
      fileName: "Daftar Stok_" + moment().format("D-M-YYYY") + ".xlsx",
    };
  },
  methods: {
    async getStokList() {
      try {
        const stok = await axios.get(useEnvStore().apiUrl + "/api/stock");
        this.stok = stok.data.data;
        this.dataToExport = stok.data.data.map((item) => ({
          Barang: item.product.name.toUpperCase(),
          Stok: item.quantity,
        }));
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getStokList();
  },
};
</script>
