<template>
  <div>
    <div v-if="loading" class="flex flex-col w-full h-max gap-4">
      <svg
        class="mx-auto animate-[pulse_0.75s_infinite] h-10 w-10 rounded-full bg-primary"
        viewBox="0 0 24 24"
      ></svg>
    </div>
    <div v-else class="flex flex-col w-full h-max gap-4">
      <!-- header -->
      <div class="flex gap-1 text-xs">
        <NuxtLink to="/pembelian" class="text-black/60 hover:text-primary"
          >Penjualan
        </NuxtLink>
        <div class="text-primary capitalize">/ {{ dataBarang.nota_id }}</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Detail Penjualan</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- content -->
      <div class="flex flex-col w-full gap-4">
        <!-- title -->
        <Table class="w-1/2">
          <TableBody>
            <TableRow class="border-none">
              <TableCell class="pb-0">Nomor Nota</TableCell>
              <TableCell class="pb-0">: {{ dataBarang.nota_id }}</TableCell>
            </TableRow>
            <TableRow class="border-none">
              <TableCell>Tanggal</TableCell>
              <TableCell>: {{ useFormat.dateFormat(dataBarang.date) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <!-- items -->
        <Table>
          <TableHeader class="border-b border-black text-primary">
            <TableHead>Barang</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Total Harga</TableHead>
          </TableHeader>
          <TableBody class="border-b border-black/10 capitalize">
            <TableRow v-for="item in detailBarang" :key="item.index">
              <TableCell>{{ item.name }}</TableCell>
              <TableCell>{{ item.quantity }}</TableCell>
              <TableCell>{{ useFormat.currencyFormat(item.selling_price) }}</TableCell>
              <TableCell>{{ useFormat.currencyFormat(item.total_price) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table class="w-full text-right">
          <TableBody>
            <TableRow>
              <TableCell class="font-semibold"
                >Total Penjualan: {{ useFormat.currencyFormat(dataBarang.final_price) }}</TableCell
              >
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUseFormat } from "@/stores/useFormat";
import { useEnvStore } from "@/stores/envStore";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
export default {
  setup() {
    useSeoMeta({
      title: "Detail Penjualan | Kasirgue",
    });
    const useFormat = useUseFormat();
    return { useFormat };
  },
  components: {
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableCell,
    TableRow,
  },
  data() {
    return {
      dataBarang: [],
      detailBarang: [],
      loading: true,
    };
  },
  methods: {
    async getDataBarang() {
      try {
        const barang = await axios.get(
          useEnvStore().apiUrl + "/api/tx-sell/" + this.$route.params.id
        );
        this.dataBarang = barang.data.data;
        this.detailBarang = barang.data.data.items;
        console.log(this.dataBarang);
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getDataBarang();
  },
};
</script>

<style lang="scss" scoped></style>
