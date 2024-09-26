<template>
  <div class="flex flex-col w-full h-max gap-4">
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Pengaturan</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
    <!-- content -->
    <div class="flex flex-col md:flex-row gap-4">
      <!-- satuan -->
      <div
        class="flex w-full md:w-1/3 h-72 border-2 rounded-xl border-primary/60 overflow-auto scrollbar-hide">
        <Satuan />
      </div>
      <!-- metode pembayaran -->
      <div
        class="flex w-full md:w-1/3 h-72 border-2 rounded-xl border-primary/60 overflow-auto scrollbar-hide">
        <MetodePembayaran />
      </div>
    </div>
  </div>
</template>
<script>
import Satuan from "@/components/satuan-pengaturan.vue";
import MetodePembayaran from "@/components/metode-pembayaran.vue";
export default {
  setup() {
    useSeoMeta({
      title: "Pengaturan | Kasirgue",
    });
  },
  components: {
    Satuan,
    MetodePembayaran,
  },
};
</script>

<style lang="scss" scoped></style>
