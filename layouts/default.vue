<template>
  <div class="flex gap-4">
      <Sidebar />
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/sidebar.vue";
export default {
  components: {
    Sidebar
  },
};
</script>
<style scoped></style>
