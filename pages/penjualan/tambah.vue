<template>
  <div>
    <div class="flex flex-col w-full h-max gap-4">
      <div class="flex gap-1 text-xs">
        <NuxtLink to="/pembelian" class="text-black/60 hover:text-primary"
          >Pembelian
        </NuxtLink>
        <div class="text-primary">/ Tambah Penjualan</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Tambah Penjualan</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- content section -->
      <div class="flex flex-row w-full gap-4">
        <!-- select dropdown -->
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Nama Produk</Label>

          <ComboboxRoot v-model="selected" class="relative">
            <ComboboxAnchor
              class="w-full inline-flex items-baseline justify-between rounded-md px-[15px] text-sm leading-none h-[35px] gap-[5px] bg-white border border-1 border-black/30 focus-visible:ring-primary"
            >
              <ComboboxInput
                class="!bg-transparent outline-none h-full selection:bg-grass5 placeholder-mauve8 capitalize"
                placeholder="Ketik nama barang..."
              />
              <ComboboxTrigger> </ComboboxTrigger>
            </ComboboxAnchor>

            <ComboboxContent
              class="absolute z-10 w-full mt-2 min-w-[160px] bg-white overflow-hidden rounded border border-1 border-primary"
            >
              <ComboboxViewport class="p-[5px]">
                <ComboboxEmpty
                  class="text-mauve8 text-xs font-medium text-center py-2"
                />

                <ComboboxGroup>
                  <ComboboxItem
                    v-for="item in listBarang"
                    :key="item.index"
                    class="text-sm leading-none rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-grass9 data-[highlighted]:text-grass1 capitalize"
                    :value="item.name"
                  >
                    <ComboboxItemIndicator
                      class="absolute left-0 w-[25px] inline-flex items-center justify-center"
                    >
                    </ComboboxItemIndicator>
                    <span>
                      {{ item.name }}
                    </span>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxViewport>
            </ComboboxContent>
          </ComboboxRoot>
        </div>
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Jumlah</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary"
            type="number"
            v-model="jumlah"
          />
        </div>
        <div class="flex flex-col justify-end w-1/4 gap-2">
          <Button
            class="w-max bg-primary text-white"
            @click="addToTransStore()"
          >
            Tambah
          </Button>
        </div>
      </div>
      <!-- table content -->
      <Table v-if="showTable">
        <TableHeader class="border-b border-primary">
          <TableHead>Barang</TableHead>
          <TableHead>Harga Jual</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Total</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="item in transStore"
            :key="item.id"
            class="borer-b border-black/10 capitalize"
          >
            <TableCell>{{ item.name }}</TableCell>
            <TableCell>{{ item.selling_price }}</TableCell>
            <TableCell>{{ item.quantity }}</TableCell>
            <TableCell>{{ item.total_price }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div class="flex w-full justify-end gap-4">
        <Button
          class="w-max bg-red text-white"
          @click="this.$router.push('/pembelian')"
        >
          Kembali
        </Button>
        <Button class="w-max bg-primary text-white" @click="tambahPembelian()">
          Simpan
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { useEnvStore } from "@/stores/envStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
} from "radix-vue";
export default {
  setup() {
    useSeoMeta({
      title: "Tambah Penjualan | Kasirgue",
    });
  },
  components: {
    Input,
    Label,
    Button,
    ComboboxAnchor,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxRoot,
    ComboboxSeparator,
    ComboboxTrigger,
    ComboboxViewport,
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableCell,
    TableRow,
  },
  data() {
    return {
      listBarang: [],
      selected: "",
      transStore: [],
      showTable: false,
      harga_beli: null,
      jumlah: null,
    };
  },
  methods: {
    addToTransStore() {
      const filteredBarang = this.listBarang.filter(
        (item) => item.name === this.selected
      );
      console.log(filteredBarang);
      let tempStore = {
        name: this.selected,
        product_id: filteredBarang[0].id,
        selling_price: filteredBarang[0].selling_price,
        quantity: this.jumlah,
        total_price: filteredBarang[0].selling_price * this.jumlah,
      };
      this.transStore.push(tempStore);
      this.showTable = true;
      this.jumlah = null;
      this.selected = "";
      console.log(this.transStore);
    },
    async getBarangList() {
      try {
        const barang = await axios.get(
          useEnvStore().apiUrl + "/api/product-master"
        );
        this.listBarang = barang.data.data;
        console.log(this.listBarang);
      } catch (err) {
        console.log(err);
      }
    },
    async tambahPembelian() {
      const finalPrice = this.transStore.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total_price;
      }, 0);
      try {
        const beli = await axios.post(useEnvStore().apiUrl + "/api/tx-sell", {
          date: moment(),
          items: this.transStore,
          final_price: finalPrice,
        });
        this.$router.push("/");
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

<style lang="scss" scoped></style>
