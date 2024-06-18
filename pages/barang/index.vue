<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Daftar Barang</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div class="flex justify-end">
      <NuxtLink to="/barang/tambah-barang">
        <PlusCircleIcon class="w-8 text-primary" />
      </NuxtLink>
    </div>
    <EasyDataTable
      class="capitalize"
      :headers="headers"
      :items="barang"
      :loading="loading"
      :theme-color="color">
      <template #item-actions="item" v-slot:item.actions="{ item }">
        <NuxtLink :to="/barang/ + item.id">
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/vue/24/solid";
import { useEnvStore } from "@/stores/envStore";
import axios from "axios";
export default {
  setup() {
    useSeoMeta({
      title: "Barang | Kasirgue",
    });
  },
  components: {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Button,
    ScrollArea,
    PlusCircleIcon,
    ArrowTopRightOnSquareIcon,
  },
  data() {
    return {
      loading: true,
      color:"#0b324f",
      headers: [
        { text: "Barang", value: "name" },
        { text: "Harga Beli", value: "buying_price" },
        { text: "Harga Jual", value: "selling_price" },
        { text: "Stok", value: "stock.quantity" },
        { text: "Satuan", value: "stock.satuan" },
        { text: "", value: "actions" },
      ],
      barang: [],
    };
  },
  methods: {
    async getBarangList() {
      try {
        const barang = await axios.get(
          useEnvStore().apiUrl + "/api/product-master"
        );
        this.barang = barang.data.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getBarangList();
  },
};
</script>
