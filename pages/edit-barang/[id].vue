<template>
  <div>
    <div v-if="loading" class="flex flex-col w-full h-max gap-4">
      <svg
        class="mx-auto animate-[pulse_0.75s_infinite] h-10 w-10 rounded-full bg-primary"
        viewBox="0 0 24 24"
      ></svg>
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
      <div class="flex flex-row w-full gap-4">
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Nama Produk</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary capitalize"
            v-model="nama"
          />
        </div>
        <div class="flex flex-col w-1/4 gap-2">
          <Label class="text-primary">Harga Beli</Label>
          <Input
            disabled
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
            disabled
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
        <Button class="w-max bg-primary text-white" @click="editBarang()">
          Simpan
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useEnvStore } from "@/stores/envStore";
import { Input } from "@/components/ui/input";
export default {
  setup(){
    useSeoMeta({
      title: "Edit Barang | Kasirgue",
    });
  },
  components: {
    Input,
  },
  data() {
    return {
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
        this.satuan = this.dataBarang.stock.satuan;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async editBarang() {
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
        this.$router.push("/barang")
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
