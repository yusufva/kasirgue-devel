<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Daftar Barang</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div class="flex gap-4 mb-4 justify-between md:justify-end">
      <Input
        v-model="searchValue"
        class="w-1/2 md:w-1/5 text-xs border-black/30 focus-visible:ring-primary"
        placeholder="Cari Barang" />
      <NuxtLink to="/barang/tambah-barang">
        <PlusCircleIcon class="w-8 text-primary" />
      </NuxtLink>
    </div>
    <EasyDataTable
      class="capitalize"
      :headers="headers"
      :items="barang"
      :search-value="searchValue"
      :search-field="searchField"
      :loading="loading"
      :theme-color="color">
      <template #item-buying_price="item" v-slot:item.buying_price="{ item }">
        <div>{{ useFormat.currencyFormat(item.buying_price) }}</div>
      </template>
      <template #item-selling_price="item" v-slot:item.selling_price="{ item }">
        <div>{{ useFormat.currencyFormat(item.selling_price) }}</div>
      </template>
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/vue/24/solid";
import { useEnvStore } from "@/stores/envStore";
import { useUseFormat } from "@/stores/useFormat";
import axios from "axios";
export default {
  setup() {
    useSeoMeta({
      title: "Barang | Kasirgue",
    });
    const useFormat = useUseFormat();
    return { useFormat };
  },
  components: {
    Input,
    Button,
    ScrollArea,
    PlusCircleIcon,
    ArrowTopRightOnSquareIcon,
  },
  data() {
    return {
      loading: true,
      color: "#0b324f",
      headers: [
        { text: "Barang", value: "name", fixed: true },
        { text: "Harga Beli", value: "buying_price" },
        { text: "Harga Jual", value: "selling_price" },
        { text: "Stok", value: "stock.quantity" },
        { text: "Satuan", value: "stock.satuan.kd_satuan" },
        { text: "", value: "actions" },
      ],
      barang: [],
      searchValue: "",
      searchField: "name",
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
