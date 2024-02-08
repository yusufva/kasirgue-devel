<template>
  <div class="flex gap-4 pr-4 pb-4 w-screen h-screen">
    <Sidebar />
    <div class="flex flex-col w-full">
      <Header />
      <div class="w-full h-full p-4 rounded-lg bg-black/5">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Sidebar from "@/components/sidebar.vue";
export default {
  components: {
    Sidebar,
    Header,
  },
};
</script>
<style scoped></style>
