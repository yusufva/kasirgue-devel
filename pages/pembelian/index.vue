<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Daftar Pembelian</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div class="flex gap-4 justify-end">
      <div class="w-1/5 mr-auto">
        <VueDatePicker></VueDatePicker>
      </div>
      <Input
        v-model="searchValue"
        class="w-1/5 text-xs border-black/30 focus-visible:ring-primary"
        placeholder="Cari Nomor Nota"
      />
      <NuxtLink to="/pembelian/tambah">
        <Button class="flex align-center bg-primary mb-4">
          <PlusIcon class="w-6 text-white" />
          <div class="text-white">Tambah Pembelian</div>
        </Button>
      </NuxtLink>
    </div>
    <EasyDataTable
      :headers="headers"
      :items="beliList"
      :search-value="searchValue"
      :search-field="searchField"
      :loading="loading"
      :theme-color="color"
    >
      <template #item-date="item" v-slot:item.date="{ item }">
        <div>{{ useFormat.dateFormat(item.date) }}</div>
      </template>
      <template #item-final_price="item" v-slot:item.final_price="{ item }">
        <div>{{ useFormat.currencyFormat(item.final_price) }}</div>
      </template>
      <template #item-actions="item" v-slot:item.actions="{ item }">
        <NuxtLink :to="/pembelian/ + item.id">
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/vue/24/outline";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ArrowTopRightOnSquareIcon } from "@heroicons/vue/24/solid";
import { useEnvStore } from "@/stores/envStore";
import { useUseFormat } from "@/stores/useFormat";
import axios from "axios";
export default {
  setup() {
    useSeoMeta({
      title: "Pembelian | Kasirgue",
    });
    const useFormat = useUseFormat();
    return { useFormat };
  },
  components: {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Input,
    Button,
    ScrollArea,
    VueDatePicker,
    PlusIcon,
    ArrowTopRightOnSquareIcon,
  },
  data() {
    return {
      loading: true,
      headers: [
        { text: "Nomor Nota", value: "nota_id" },
        { text: "Tanggal", value: "date" },
        { text: "Total Harga", value: "final_price" },
        { text: "", value: "actions" },
      ],
      beliList: [],
      color: "#0b324f",
      searchValue: "",
      searchField: "nota_id",
    };
  },
  methods: {
    async getBeliList() {
      try {
        const beli = await axios.get(useEnvStore().apiUrl + "/api/tx-buy");
        this.beliList = beli.data.data;
        console.log(this.beliList);
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getBeliList();
  },
};
</script>
