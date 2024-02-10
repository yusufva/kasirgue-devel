<template>
  <div>
    <div class="flex justify-end">
      <NuxtLink to="/barang/tambahbarang">
        <PlusCircleIcon class="w-8 text-primary" />
      </NuxtLink>
    </div>
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader class="text-primary font-poppins">
        <TableRow>
          <TableHead> Barang </TableHead>
          <TableHead>Harga Beli</TableHead>
          <TableHead>Harga Jual</TableHead>
          <TableHead class="text-right"> Stok </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="item in barang"
          :key="item.index"
          class="border-b border-black/10"
        >
          <TableCell class="font-medium">
            {{ item.name }}
          </TableCell>
          <TableCell>{{ item.buying_price }}</TableCell>
          <TableCell>{{ item.selling_price }}</TableCell>
          <TableCell class="text-right">
            {{ item.stock.quantity }}
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
import { PlusCircleIcon } from "@heroicons/vue/24/solid";
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
    PlusCircleIcon,
  },
  data() {
    return {
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
        console.log(barang);
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
