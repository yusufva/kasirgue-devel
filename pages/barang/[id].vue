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
        <NuxtLink to="/barang" class="text-black/60 hover:text-primary"
          >Barang
        </NuxtLink>
        <div class="text-primary capitalize">/ {{ dataBarang.name }}</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Detail Barang</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- content -->
      <div class="flex flex-col">
        <Table>
          <TableBody>
            <TableRow class="border-b border-black/10">
              <TableCell class="w-1/3">Nama</TableCell>
              <TableCell class="capitalize">: {{ dataBarang.name }}</TableCell>
            </TableRow>
            <TableRow class="border-b border-black/10">
              <TableCell class="w-1/3">Harga Beli</TableCell>
              <TableCell>: {{ dataBarang.buying_price }}</TableCell>
            </TableRow>
            <TableRow class="border-b border-black/10">
              <TableCell class="w-1/3">Harga Jual</TableCell>
              <TableCell>: {{ dataBarang.selling_price }}</TableCell>
            </TableRow>
            <TableRow class="border-b border-black/10">
              <TableCell class="w-1/3">Stock</TableCell>
              <TableCell>: {{ dataBarang.stock.quantity }}</TableCell>
            </TableRow>
            <TableRow class="border-b border-black/10">
              <TableCell class="w-1/3">Satuan</TableCell>
              <TableCell>: {{ dataBarang.stock.satuan }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="flex w-1/10 mx-auto gap-6">
        <NuxtLink :to="/edit-barang/ + dataBarang.id" class="w-1/2">
          <Button class="bg-secondary text-white">Edit</Button>
        </NuxtLink>
        <Button class="w-1/2 bg-red text-white" @click="hapusBarang()"
          >Hapus</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUseToast } from "@/stores/useToast";
import { useEnvStore } from "@/stores/envStore";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
export default {
  setup() {
    useSeoMeta({
      title: "Detail Barang | Kasirgue",
    });
  },
  components: {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Button,
  },
  data() {
    return {
      dataBarang: [],
      loading: true,
    };
  },
  methods: {
    async getDataBarang() {
      try {
        const barang = await axios.get(
          useEnvStore().apiUrl + "/api/product-master/" + this.$route.params.id
        );
        console.log(barang);
        this.dataBarang = barang.data.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async hapusBarang() {
      try {
        const hapus = await axios.delete(
          useEnvStore().apiUrl + "/api/product-master/" + this.$route.params.id
        );
        useUseToast().deleteToast
        this.$router.push("/barang");
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
