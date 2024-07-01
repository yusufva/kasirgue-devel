<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster/>
  </NuxtLayout>
</template>

<script>
import Toaster from "@/components/ui/toast/Toaster.vue"
export default {
  setup() {
    useSeoMeta({
      title: "Kasirgue",
    });
  },
  components: {
    Toaster,
  },
};
</script>
