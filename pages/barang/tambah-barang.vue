<template>
  <div>
    <div class="flex flex-col w-full h-max gap-4">
      <div class="flex gap-1 text-xs">
        <NuxtLink to="/barang" class="text-black/60 hover:text-primary"
          >Barang
        </NuxtLink>
        <div class="text-primary">/ Tambah Barang</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Tambah Barang</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- input section -->
      <div class="flex flex-row w-full gap-4">
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Nama Produk</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary capitalize"
            v-model="nama_produk" />
        </div>
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Harga Beli</Label>
          <CurrencyInput
            class="border-black/30 focus-visible:ring-primary flex h-9 w-full rounded-md border border-slate-200 border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
            :options="{ currency: 'IDR', locale: 'id-ID' }"
            v-model="harga_beli" />
        </div>
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Harga Jual</Label>
          <CurrencyInput
            class="border-black/30 focus-visible:ring-primary flex h-9 w-full rounded-md border border-slate-200 border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
            :options="{ currency: 'IDR', locale: 'id-ID' }"
            v-model="harga_jual" />
        </div>
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Satuan</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary"
            v-model="satuan" />
        </div>
      </div>
      <div class="flex w-full justify-end gap-4">
        <Button
          class="w-max bg-red text-white"
          @click="this.$router.push('/barang')">
          Kembali
        </Button>
        <Button class="w-max bg-primary text-white" @click="tambahBarang()">
          <div v-if="loading">
            <PulseLoader
              :color="loadingColor"
              :size="loadingSize"></PulseLoader>
          </div>
          <div v-else>Tambah</div>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import CurrencyInput from "@/components/currency-input.vue";
import { useUseToast } from "@/stores/useToast";
import { useEnvStore } from "@/stores/envStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
export default {
  setup() {
    useSeoMeta({
      title: "Tambah Barang | Kasirgue",
    });
  },
  components: {
    Input,
    CurrencyInput,
    Label,
    Button,
    PulseLoader,
  },
  data() {
    return {
      loading: false,
      loadingColor: "#ffffff",
      loadingSize: "5px",
      nama_produk: "",
      harga_beli: null,
      harga_jual: null,
      satuan: null,
    };
  },
  methods: {
    async tambahBarang() {
      this.loading = true;
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
        useUseToast().addToast();
        this.$router.push("/barang");
      } catch (err) {
        if (err.response.status === 400) {
          this.loading = false;
          useUseToast().formNotCompleted();
        }
        if (err.response.status === 409) {
          this.loading = false;
          useUseToast().sameProductName();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
