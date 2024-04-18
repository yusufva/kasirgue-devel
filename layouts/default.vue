<template>
  <div class="flex gap-4 pr-4 pb-4 w-full min-h-screen bg-black/5">
    <Sidebar />
    <div class="flex flex-col w-full">
      <Header />
      <div class="w-full h-max rounded-md bg-white p-10">
        <slot />
        <!-- tambah penjualan -->
        <div class="flex fixed bottom-4 right-4">
          <NuxtLink to="/penjualan/tambah">
            <Button class="bg-primary text-white gap-1">
              <PlusIcon class="w-6" />Tambah Transaksi
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PlusIcon } from "@heroicons/vue/24/outline";
import { Button } from "@/components/ui/button";
import Header from "@/components/header.vue";
import Sidebar from "@/components/sidebar.vue";
export default {
  components: {
    Sidebar,
    Header,
    Button,
    PlusIcon,
  },
};
</script>
<style scoped></style>
