<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Daftar Transaksi Penjualan</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <Table>
      <TableHeader class="text-primary font-poppins">
        <TableRow>
          <TableHead>ID Transaksi</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Total Harga</TableHead>
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
          v-for="item in jualList"
          :key="item.index"
          class="border-b border-black/10"
        >
          <TableCell>{{ item.id }}</TableCell>
          <TableCell>{{ useFormat.dateFormat(item.date) }}</TableCell>
          <TableCell>{{ useFormat.currencyFormat(item.final_price) }}</TableCell>
          <TableCell>
            <NuxtLink class="flex items-center text-primary text-xs gap-1" :to="/penjualan/+item.id">
              <ArrowTopRightOnSquareIcon class="w-5"/>Detail
            </NuxtLink>
          </TableCell>
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
import { PlusIcon } from "@heroicons/vue/24/outline";
import { ArrowTopRightOnSquareIcon } from "@heroicons/vue/24/solid";
import { useEnvStore } from "@/stores/envStore";
import { useUseFormat } from "@/stores/useFormat";
import axios from "axios";
export default {
  setup(){
    const useFormat = useUseFormat()
    return {useFormat}
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
    PlusIcon,
    ArrowTopRightOnSquareIcon
  },
  data() {
    return {
      loading: true,
      jualList: [],
    };
  },
  methods: {
    async getJualList() {
      try {
        const beli = await axios.get(useEnvStore().apiUrl + "/api/tx-sell");
        this.jualList = beli.data.data;
        console.log(this.jualList);
        this.loading = false;
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
