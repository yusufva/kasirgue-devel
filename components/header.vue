<template>
  <div>
    <div class="flex w-full h-20 items-center justify-between">
      <div class="text-2xl">PT. ACME Indonesia</div>
      <Button class="bg-red text-white" @click="logOut()">Logout</Button>
    </div>
  </div>
</template>

<script>
import Button from "@/components/ui/button/Button.vue";
import { useAuthStore } from "@/stores/authStore";
export default {
  components: {
    Button,
  },
  methods: {
    logOut() {
      useAuthStore().logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped></style>
