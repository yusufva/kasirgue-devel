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
        <NuxtLink to="/barang" class="text-black/60 hover:text-primary"
          >Barang
        </NuxtLink>
        <div class="text-primary capitalize">/ {{ dataBarang.name }}</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Edit Barang</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- content -->
      <div class="flex flex-col md:flex-row w-full gap-4">
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Nama Produk</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary capitalize"
            v-model="nama" />
        </div>
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Harga Beli</Label>
          <CurrencyInput
            disabled
            class="border-black/30 focus-visible:ring-primary flex h-9 w-full rounded-md border border-slate-200 border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
            :options="{ currency: 'IDR', locale: 'id-ID' }"
            v-model="harga_beli" />
        </div>
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Harga Jual</Label>
          <CurrencyInput
            class="border-black/30 focus-visible:ring-primary flex h-9 w-full rounded-md border border-slate-200 border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
            :options="{ currency: 'IDR', locale: 'id-ID' }"
            v-model="harga_jual" />
        </div>
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Satuan</Label>
          <Input
            disabled
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
        <Button class="w-max bg-primary text-white" @click="editBarang()">
          <div v-if="loadingSubmit">
            <PulseLoader
              :color="loadingColor"
              :size="loadingSize"></PulseLoader>
          </div>
          <div v-else>Simpan</div>
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
export default {
  setup() {
    useSeoMeta({
      title: "Edit Barang | Kasirgue",
    });
  },
  components: {
    Input,
    CurrencyInput,
    PulseLoader,
  },
  data() {
    return {
      loading: false,
      loadingSubmit: false,
      loadingColor: "#ffffff",
      loadingSize: "5px",
      dataBarang: [],
      loading: true,
      nama: null,
      harga_beli: null,
      harga_jual: null,
      satuan: null,
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
        this.nama = this.dataBarang.name;
        this.harga_beli = this.dataBarang.buying_price;
        this.harga_jual = this.dataBarang.selling_price;
        this.satuan = this.dataBarang.stock.satuan.kd_satuan;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async editBarang() {
      this.loadingSubmit = true;
      try {
        const edit = await axios.put(
          useEnvStore().apiUrl + "/api/product-master/" + this.$route.params.id,
          {
            id: this.$route.params.id,
            name: this.nama.toLowerCase(),
            buying_price: this.harga_beli,
            selling_price: this.harga_jual,
            stock: this.dataBarang.stock.quantity,
          }
        );
        useUseToast().editToast();
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
