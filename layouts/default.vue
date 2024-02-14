<template>
  <div class="flex gap-4 pr-4 pb-4 w-full min-h-screen bg-black/5">
    <Sidebar />
    <div class="flex flex-col w-full">
      <Header />
      <div class="w-full max-h-full rounded-md bg-white p-10">
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
