<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Daftar Pembelian</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div class="flex justify-end">
      <NuxtLink to="/barang/tambah-barang">
        <Button class="flex align-center bg-primary">
          <PlusIcon class="w-6 text-white" />
          <div class="text-white">Tambah Pembelian</div>
        </Button>
      </NuxtLink>
    </div>
    <Table>
      <TableHeader class="text-primary font-poppins">
        <TableRow>
          <TableHead>Tanggal</TableHead>
          <TableHead>Barang</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Jumlah</TableHead>
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
          v-for="item in beliList"
          :key="item.index"
          class="border-b border-black/10"
        >
          <TableCell>{{ item.date }}</TableCell>
          <TableCell class="font-medium capitalize">
            {{ item.items[0].name }}
          </TableCell>
          <TableCell>{{ item.items[0].buying_price }}</TableCell>
          <TableCell>{{ item.items[0].quantity }}</TableCell>
          <TableCell>{{ item.items[0].total_price }}</TableCell>
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
    PlusIcon,
  },
  data() {
    return {
      loading: true,
      beliList: [],
    };
  },
  methods: {
    async getBeliList() {
      try {
        const beli = await axios.get(
          useEnvStore().apiUrl + "/api/tx-buy"
        );
        this.beliList = beli.data.data;
        console.log(this.beliList)
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
