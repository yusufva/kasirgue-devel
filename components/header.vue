<template>
  <div>
    <div class="flex w-full h-20 px-2 md:px-0 items-center justify-between">
      <div class="text-xl md:text-2xl">PT. ACME Indonesia</div>
      <Bars3Icon
        class="md:hidden w-8"
        @click="showMobileMenu = !showMobileMenu"></Bars3Icon>
      <Button class="hidden md:flex bg-red text-white" @click="logOut()">
        Logout
      </Button>
    </div>
    <Transition name="slide">
      <div
        v-if="showMobileMenu"
        class="flex flex-col bg-white w-full h-full fixed p-4 top-0 z-20">
        <div class="flex w-full h-max">
          <XMarkIcon
            class="ml-auto mb-auto w-8"
            @click="showMobileMenu = !showMobileMenu"></XMarkIcon>
        </div>
        <img :src="Logo" class="w-1/2 mx-auto" />
        <div class="flex flex-col gap-4 mt-10 mx-auto">
          <div v-for="item in links" :key="item.index">
            <NuxtLink
              :to="item.route"
              class="flex w-max p-2 text-primary rounded-md hover:bg-primary hover:text-white"
              exactActiveClass="bg-primary text-white"
              @click="showMobileMenu = !showMobileMenu">
              <component :is="item.icon" class="w-6"></component>
              <div>{{ item.title }}</div>
            </NuxtLink>
          </div>
        </div>
        <Button class="md:hidden flex bg-red text-white mt-4" @click="logOut()">
          Logout
        </Button>
      </div>
    </Transition>
  </div>
</template>

<script>
import Button from "@/components/ui/button/Button.vue";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDoubleRightIcon,
  HomeIcon,
  ArchiveBoxIcon,
  RectangleStackIcon,
  UsersIcon,
  SquaresPlusIcon,
  ShoppingCartIcon,
} from "@heroicons/vue/24/solid";
import Logo from "@/assets/images/logo.png";
import { useAuthStore } from "@/stores/authStore";
export default {
  components: {
    Button,
    Bars3Icon,
    XMarkIcon,
    ChevronDoubleRightIcon,
    HomeIcon,
    ArchiveBoxIcon,
    RectangleStackIcon,
    UsersIcon,
    SquaresPlusIcon,
    ShoppingCartIcon,
  },
  data() {
    return {
      showMobileMenu: false,
      Logo: Logo,
      links: [
        { title: "Beranda", icon: "HomeIcon", route: "/" },
        { title: "Barang", icon: "ArchiveBoxIcon", route: "/barang" },
        { title: "Stok", icon: "RectangleStackIcon", route: "/stok" },
        { title: "Supplier", icon: "UsersIcon", route: "/supplier" },
        { title: "Pembelian", icon: "SquaresPlusIcon", route: "/pembelian" },
        { title: "Penjualan", icon: "ShoppingCartIcon", route: "/penjualan" },
        { title: "Laba Rugi", icon: "ArrowsUpDownIcon", route: "/labarugi" },
      ],
    };
  },
  methods: {
    logOut() {
      useAuthStore().logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}
.slide-enter-from {
  transform: translateY(100%);
}
.slide-leave-to {
  transform: translateY(100%);
}
</style>
