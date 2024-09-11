<template>
  <div class="flex flex-col w-full h-max gap-4">
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Daftar Stok</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
    <!-- content -->
    <EasyDataTable
      :headers="headers"
      :items="stok"
      class="capitalize"
      :loading="loading"
      :theme-color="color">
      <template #item-quantity="item" v-slot:item.actions="{ item }">
        <div>{{ item.quantity + " " + item.satuan }}</div>
      </template>
    </EasyDataTable>
  </div>
</template>

<script>
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  PlusCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/vue/24/solid";
import { useEnvStore } from "@/stores/envStore";
import axios from "axios";
export default {
  setup() {
    useSeoMeta({
      title: "Stok | Kasirgue",
    });
  },
  components: {
    Button,
    ScrollArea,
    PlusCircleIcon,
    ArrowTopRightOnSquareIcon,
  },
  data() {
    return {
      loading: true,
      headers: [
        { text: "Barang", value: "product.name" },
        { text: "Jumlah Stok", value: "quantity" },
      ],
      stok: [],
      color: "#0b324f",
    };
  },
  methods: {
    async getStokList() {
      try {
        const stok = await axios.get(useEnvStore().apiUrl + "/api/stock");
        this.stok = stok.data.data;
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
