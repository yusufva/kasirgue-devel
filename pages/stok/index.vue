<template>
  <div class="flex flex-col w-full h-max gap-4">
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Daftar Stok</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
    <!-- content -->
    <ScrollArea class="h-80 lg:h-[600px] w-full border-b-2 border-b-primary/20">
      <Table>
        <TableHeader class="text-primary bg-white font-poppins">
          <TableRow>
            <TableHead>Barang </TableHead>
            <TableHead></TableHead>
            <TableHead>Jumlah Stok</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody v-if="loading">
          <TableCell></TableCell>
          <TableCell class="flex w-full">
            <svg
              class="mx-auto mt-10 animate-[pulse_0.75s_infinite] h-10 w-10 rounded-full bg-primary"
              viewBox="0 0 24 24"
            ></svg>
          </TableCell>
          <TableCell></TableCell>
        </TableBody>
        <TableBody v-else>
          <TableRow
            v-for="item in stok"
            :key="item.index"
            class="border-b border-black/10"
          >
            <TableCell class="font-medium capitalize">
              {{ item.product.name }}
            </TableCell>
            <TableCell></TableCell>
            <TableCell>{{ item.quantity }} {{ item.satuan }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </ScrollArea>
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
      stok: [],
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
