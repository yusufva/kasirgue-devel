<template>
  <div>
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader class="text-primary">
        <TableRow>
          <TableHead class="w-[100px]"> Invoice </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-right"> Amount </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="item in barang"
          :key="item.index"
          class="border-b border-black/10"
        >
          <TableCell class="font-medium">
            {{ item.item }}
          </TableCell>
          <TableCell>{{ item.paymentStatus }}</TableCell>
          <TableCell>{{ item.paymentMethod }}</TableCell>
          <TableCell class="text-right">
            {{ item.totalAmount }}
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
        this.barang = barang.data;
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
