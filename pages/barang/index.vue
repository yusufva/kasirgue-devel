<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Daftar Barang</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div class="flex justify-end">
      <NuxtLink to="/barang/tambah-barang">
        <PlusCircleIcon class="w-8 text-primary" />
      </NuxtLink>
    </div>
    <ScrollArea class="h-80 w-full border-b-2 border-b-primary/20">
      <Table>
        <TableHeader class="text-primary bg-white font-poppins">
          <TableRow>
            <TableHead> Barang </TableHead>
            <TableHead>Harga Beli</TableHead>
            <TableHead>Harga Jual</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Satuan</TableHead>
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
            v-for="item in barang"
            :key="item.index"
            class="border-b border-black/10"
          >
            <TableCell class="font-medium capitalize">
              {{ item.name }}
            </TableCell>
            <TableCell>{{ item.buying_price }}</TableCell>
            <TableCell>{{ item.selling_price }}</TableCell>
            <TableCell>{{ item.stock.quantity }}</TableCell>
            <TableCell>{{ item.stock.satuan }}</TableCell>
            <TableCell class="text-right">
              <NuxtLink :to="/barang/ + item.id">
                <Button class="bg-primary rounded-full p-3">
                  <ArrowTopRightOnSquareIcon class="w-4 text-white" />
                </Button>
              </NuxtLink>
            </TableCell>
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/vue/24/solid";
import { useEnvStore } from "@/stores/envStore";
import axios from "axios";
export default {
  setup() {
    useSeoMeta({
      title: "Barang | Kasirgue",
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
        this.loading = false;
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
