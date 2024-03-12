<template>
  <div class="flex flex-col w-full h-max gap-4">
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Daftar Stok</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
    <!-- content -->
    <Table>
      <TableHeader class="text-primary font-poppins">
        <TableRow>
          <TableHead>Barang </TableHead>
          <TableHead>Jumlah Stok</TableHead>
          <TableHead class="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="loading">
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>
          <svg
            class="mx-auto mt-10 animate-[pulse_0.75s_infinite] h-10 w-10 rounded-full bg-primary"
            viewBox="0 0 24 24"
          ></svg>
        </TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
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
          <TableCell>{{ item.quantity }} {{ item.satuan }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
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
import {
  PlusCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/vue/24/solid";
import { useEnvStore } from "@/stores/envStore";
import axios from "axios";
export default {
  components: {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Button,
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
