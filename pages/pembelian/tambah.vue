<template>
  <div>
    <div class="flex flex-col w-full h-max gap-4">
      <div class="flex gap-1 text-xs">
        <NuxtLink to="/pembelian" class="text-black/60 hover:text-primary"
          >Pembelian
        </NuxtLink>
        <div class="text-primary">/ Tambah Pembelian</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Tambah Pembelian</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- input section -->
      <div class="flex flex-row w-full gap-4">
        <!-- select dropdown -->
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Nama Produk</Label>

          <ComboboxRoot v-model="selected" class="relative">
            <ComboboxAnchor
              class="w-full inline-flex items-baseline justify-between rounded rounded-md px-[15px] text-sm leading-none h-[36px] gap-[5px] bg-white border border-1 border-black/30 focus-visible:ring-primary"
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
          {{ selected }}
        </div>
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Harga Beli</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary"
            type="number"
            v-model="harga_beli"
          />
        </div>
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Harga Jual</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary"
            type="number"
            v-model="harga_jual"
          />
        </div>
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Satuan</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary"
            v-model="satuan"
          />
        </div>
      </div>
      <div class="flex w-full justify-end gap-4">
        <Button
          class="w-max bg-red text-white"
          @click="this.$router.push('/barang')"
        >
          Kembali
        </Button>
        <Button class="w-max bg-primary text-white" @click="tambahBarang()">
          Tambah
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useEnvStore } from "@/stores/envStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  },
  data() {
    return {
      listBarang: [],
      selected: "",
      nama_produk: null,
      harga_beli: null,
      harga_jual: null,
      satuan: null,
    };
  },
  methods: {
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
    async tambahBarang() {
      try {
        const barang = await axios.post(
          useEnvStore().apiUrl + "/api/product-master",
          {
            name: this.nama_produk.toLowerCase(),
            buying_price: this.harga_beli,
            selling_price: this.harga_jual,
            stock: {
              quantity: 0,
              satuan: this.satuan,
            },
          }
        );
        this.$router.push("/barang");
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
