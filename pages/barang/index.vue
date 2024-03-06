<template>
  <div>
    <div class="flex justify-end">
      <NuxtLink to="/barang/tambah-barang">
        <PlusCircleIcon class="w-8 text-primary" />
      </NuxtLink>
    </div>
    <Table>
      <TableHeader class="text-primary font-poppins">
        <TableRow>
          <TableHead> Barang </TableHead>
          <TableHead>Harga Beli</TableHead>
          <TableHead>Harga Jual</TableHead>
          <TableHead>Satuan</TableHead>
          <TableHead>Stok</TableHead>
          <TableHead class="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="item in barang"
          :key="item.index"
          class="border-b border-black/10"
        >
          <TableCell class="font-medium capitalize">
            {{ item.name }}
          </TableCell>
          <TableCell>{{ item.buying_price }}</TableCell>
          <TableCell>{{ item.selling_price }}</TableCell>
          <TableCell>{{ item.stock.satuan }}</TableCell>
          <TableCell>{{ item.stock.quantity }}</TableCell>
          <TableCell class="text-right">
            <NuxtLink :to="/barang/+item.id">
              <Button class="bg-primary rounded-full p-3">
                <ArrowTopRightOnSquareIcon class="w-4 text-white" />
              </Button>
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
