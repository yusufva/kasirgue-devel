<template lang="">
  <div>
    <!-- sheet sidebar -->
    <Sheet>
      <div class="hidden md:flex p-4 gap-2 items-baseline">
        <img :src="logo" class="w-[100px]" />
        <SheetTrigger>
          <ChevronDoubleRightIcon class="text-primary w-6" />
        </SheetTrigger>
      </div>
      <SheetContent side="left" class="flex p-4 w-1/6 bg-white border-none">
        <SheetHeader>
          <SheetTitle class="flex justify-center my-4">
            <img :src="logo" class="w-1/2" />
          </SheetTitle>
          <SheetDescription class="flex flex-col w-full items-center">
            <!-- admin links -->
            <div
              v-if="role === 99"
              v-for="item in links"
              :key="item.index"
              class="flex w-full justify-center">
              <NuxtLink
                :to="item.route"
                class="flex justify-start w-3/4 h-max p-2 mb-2 rounded-md text-primary hover:text-white hover:bg-primary"
                exactActiveClass="flex w-3/4 rounded-md text-white bg-primary">
                <SheetClose class="w-full">
                  <slot>
                    <div class="flex gap-2 items-center">
                      <component :is="item.icon" class="w-6"></component
                      >{{ item.title }}
                    </div>
                  </slot>
                </SheetClose>
              </NuxtLink>
            </div>
            <!-- user links -->
            <div v-if="role === 1" class="flex w-full justify-center">
              <NuxtLink
                :to="links[0].route"
                class="flex justify-start w-3/4 h-max p-2 mb-2 rounded-md text-primary hover:text-white hover:bg-primary"
                exactActiveClass="flex w-3/4 rounded-md text-white bg-primary">
                <SheetClose class="w-full">
                  <slot>
                    <div class="flex gap-2 items-center">
                      <component :is="links[0].icon" class="w-6"></component
                      >{{ links[0].title }}
                    </div>
                  </slot>
                </SheetClose>
              </NuxtLink>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
    <!-- button sidebar -->
    <div class="hidden md:flex flex-col gap-4 pl-4 mt-10">
      <div v-if="role === 99" v-for="item in links" :key="item.index">
        <NuxtLink
          :to="item.route"
          class="flex w-max p-2 text-primary rounded-md hover:bg-primary hover:text-white"
          exactActiveClass="bg-primary text-white"
          :title="item.title">
          <component :is="item.icon" class="w-6"></component>
        </NuxtLink>
      </div>
      <div v-if="role === 1">
        <NuxtLink
          :to="links[0].route"
          class="flex w-max p-2 text-primary rounded-md hover:bg-primary hover:text-white"
          exactActiveClass="bg-primary text-white"
          :title="links[0].title">
          <component :is="links[0].icon" class="w-6"></component
        ></NuxtLink>
      </div>
    </div>
  </div>
</template>
<script>
import { useAuthStore } from "@/stores/authStore";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import Logo from "@/assets/images/logo.png";
import {
  ChevronDoubleRightIcon,
  HomeIcon,
  ArchiveBoxIcon,
  RectangleStackIcon,
  UsersIcon,
  SquaresPlusIcon,
  ShoppingCartIcon,
  ArrowsUpDownIcon,
} from "@heroicons/vue/24/solid";

export default {
  components: {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Card,
    CardContent,
    CardDescription,
    ChevronDoubleRightIcon,
    HomeIcon,
    ArchiveBoxIcon,
    RectangleStackIcon,
    UsersIcon,
    SquaresPlusIcon,
    ShoppingCartIcon,
    ArrowsUpDownIcon,
  },
  data() {
    return {
      logo: Logo,
      role: useAuthStore().role,
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
};
</script>
<style lang=""></style>
