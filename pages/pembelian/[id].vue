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
        <NuxtLink to="/pembelian" class="text-black/60 hover:text-primary"
          >Pembelian
        </NuxtLink>
        <div class="text-primary capitalize">/ {{ dataBarang.id }}</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Detail Pembelian</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- content -->
      <div class="flex flex-row w-full gap-4"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useEnvStore } from "@/stores/envStore";
export default {
  data() {
    return {
      dataBarang: [],
      loading: true,
    };
  },
  methods: {
    async getDataBarang() {
      try {
        const barang = await axios.get(
          useEnvStore().apiUrl + "/api/tx-buy/" + this.$route.params.id
        );
        this.dataBarang = barang.data.data;
        console.log(this.dataBarang)
        this.loading = false;
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
