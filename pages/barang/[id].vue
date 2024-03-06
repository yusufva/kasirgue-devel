<template>
  <div class="flex flex-col w-full h-max gap-4">
    <div class="flex gap-1 text-xs">
      <NuxtLink to="/barang" class="text-black/60 hover:text-primary"
        >Barang
      </NuxtLink>
      <div class="text-primary">/ {{ $route.params.id }}</div>
    </div>
    <div class="text-primary font-semibold text-2xl">Detail Barang</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
  </div>
</template>

<script>
import axios from "axios";
import { useEnvStore } from "@/stores/envStore";
export default {
  methods: {
    async getDataBarang() {
      try {
        barang = await axios.get(
          useEnvStore().apiUrl + "/api/product-master/" + $route.params.id
        );
        console.log(barang);
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
