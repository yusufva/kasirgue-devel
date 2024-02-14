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
            class="border-black/30 focus-visible:ring-primary"
            v-model="nama_produk"
          />
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
          <Label class="text-primary">Stok</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary"
            type="number"
            v-model="stok"
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
        <Button class="w-max bg-primary text-white" @click="tambahBarang()"> Tambah </Button>
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
export default {
  components: {
    Input,
    Label,
    Button,
  },
  data() {
    return {
      nama_produk: null,
      harga_beli: null,
      harga_jual: null,
      stok: null,
    };
  },
  methods: {
    async tambahBarang() {
      try{
        const barang = await axios.post(useEnvStore().apiUrl+"/api/product-master",{
          "name": this.nama_produk,
          "buying_price": this.harga_beli,
          "selling_price": this.harga_jual,
          "stock":{
            "quantity": this.stok
          }
        })
        this.$router.push("/barang")
      }
      catch (err){
        console.log(err)
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
