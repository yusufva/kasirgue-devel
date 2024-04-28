<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">
      Welcome, {{ userName }}!
    </div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div class="flex w-full h-full">
      <!-- stock warn table -->
      <div class="flex flex-col w-1/3 h-max bg-primary p-4">
        <div class="mx-auto text-white font-semibold">Stok Hampir Habis</div>
        <ScrollArea class="h-80 w-full border-b-2 border-b-white/20">
          <Table>
            <TableHeader class="text-white bg-primary">
              <TableRow>
                <TableHead>Barang</TableHead>
                <TableHead>Stok</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="item in stok"
                :key="item.index"
                class="border-b text-white border-black/10"
              >
                <TableCell class="font-normal capitalize">
                  {{ item.product.name }}
                </TableCell>
                <TableCell>{{ item.quantity }} {{ item.satuan }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { useEnvStore } from "@/stores/envStore";
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
    ScrollArea,
  },
  data() {
    return {
      userName: useAuthStore().name,
      stok: [],
    };
  },
  methods: {
    async getStokWarn() {
      try {
        const stok = await axios.get(useEnvStore().apiUrl + "/api/stock");
        const filteredData = stok.data.data.filter(
          (item) => item.quantity < 10
        );
        this.stok = filteredData;
        this.loading = false;
        console.log(stok);
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getStokWarn();
  },
};
</script>
