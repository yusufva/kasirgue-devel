<template>
  <div>
    <div v-if="loading" class="flex flex-col w-full h-max gap-4">
      <svg
        class="mx-auto animate-[pulse_0.75s_infinite] h-10 w-10 rounded-full bg-primary"
        viewBox="0 0 24 24"></svg>
    </div>
    <div v-else class="flex flex-col w-full h-max gap-4">
      <!-- header -->
      <div class="flex gap-1 text-xs">
        <NuxtLink to="/penjualan" class="text-black/60 hover:text-primary"
          >Penjualan
        </NuxtLink>
        <div class="text-primary capitalize">/ {{ dataBarang.nota_id }}</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Detail Penjualan</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- content -->
      <div class="flex flex-col w-full gap-4">
        <!-- title -->
        <Table class="w-full md:w-1/2">
          <TableBody>
            <TableRow class="border-none">
              <TableCell class="pb-0">Nomor Nota</TableCell>
              <TableCell class="pb-0">: {{ dataBarang.nota_id }}</TableCell>
            </TableRow>
            <TableRow class="border-none">
              <TableCell class="pb-0">Tanggal</TableCell>
              <TableCell class="pb-0">
                : {{ useFormat.dateFormat(dataBarang.date) }}
              </TableCell>
            </TableRow>
            <TableRow
              v-if="
                dataBarang.payment_note !== '' &&
                dataBarang.payment_note !== null
              "
              class="border-none">
              <TableCell class="pb-0">Keterangan</TableCell>
              <TableCell class="pb-0">
                : {{ dataBarang.payment_note }}
              </TableCell>
            </TableRow>
            <TableRow class="border-none">
              <TableCell>Metode Pembayaran</TableCell>
              <TableCell>: {{ dataBarang.payment_type }}</TableCell>
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
              <TableCell>{{ item.name }} ({{ item.satuan }})</TableCell>
              <TableCell>{{ item.quantity }}</TableCell>
              <TableCell>{{
                useFormat.currencyFormat(item.selling_price)
              }}</TableCell>
              <TableCell>{{
                useFormat.currencyFormat(item.total_price)
              }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table class="w-full text-right">
          <TableBody>
            <TableRow class="border-none">
              <TableCell class="font-semibold">
                Total Penjualan:
                {{ useFormat.currencyFormat(dataBarang.final_price) }}
              </TableCell>
            </TableRow>
            <TableRow class="border-none">
              <TableCell class="font-semibold">
                Pembayaran:
                {{ useFormat.currencyFormat(dataBarang.payment) }}
              </TableCell>
            </TableRow>
            <TableRow class="border-none">
              <TableCell class="font-semibold">
                Kembali:
                {{ useFormat.currencyFormat(dataBarang.changes) }}
              </TableCell>
            </TableRow>
            <TableRow v-if="dataBarang.admin_cut !== 0" class="border-none">
              <TableCell class="font-semibold">
                Biaya Admin (Marketplace):
                {{ useFormat.currencyFormat(dataBarang.admin_cut) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div class="flex mx-auto gap-6">
          <NuxtLink to="/penjualan">
            <Button class="bg-red text-white">Kembali</Button>
          </NuxtLink>
          <Button
            class="flex gap-1 bg-primary text-white"
            @click="printFunction()">
            <PrinterIcon class="w-5" />
            Cetak Ulang
          </Button>
        </div>
      </div>
    </div>
  </div>
  <PrintNota class="hidden" id="print-nota" :returnBeli="dataBarang" />
</template>

<script>
import axios from "axios";
import { usePaperizer } from "paperizer";
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
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "@heroicons/vue/24/solid";
import PrintNota from "@/components/nota-print-area.vue";
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
    PrintNota,
    Button,
    PrinterIcon,
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
    printFunction() {
      const { paperize } = usePaperizer("print-nota", {
        features: ["titlebar=no"],
        styles: [
          "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
        ],
      });
      paperize();
    },
  },
  mounted() {
    this.getDataBarang();
  },
};
</script>

<style lang="scss" scoped></style>
