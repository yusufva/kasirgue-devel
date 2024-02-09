<template lang="">
  <div>
    <Sheet>
      <div class="flex p-4 gap-2 items-baseline">
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
          <SheetDescription class="flex flex-col items-center">
            <div
              v-for="item in links"
              :key="item.index"
              class="flex justify-start w-3/4 h-max p-2 rounded-md text-primary hover:text-white hover:bg-primary"
            >
              <NuxtLink
                :to="item.route"
                class="flex w-full"
                exactActiveClass="flex w-full p-2 rounded-md text-white bg-primary"
              >
                <SheetClose class="w-full">
                  <Slots>
                    <div class="flex gap-2 items-center">
                      <component :is="item.icon" class="w-6"></component
                      >{{ item.title }}
                    </div>
                  </Slots>
                </SheetClose>
              </NuxtLink>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
    <div class="flex flex-col gap-4 pl-4 mt-10">
      <div v-for="item in links" :key="item.index">
        <NuxtLink :to="item.route">
          <component
            :is="item.icon"
            class="w-10 p-2 text-primary rounded-md hover:bg-primary hover:text-white"
          ></component>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script>
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
  BanknotesIcon,
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
    BanknotesIcon,
  },
  data() {
    return {
      logo: Logo,
      links: [
        { title: "Beranda", icon: "HomeIcon", route: "/" },
        { title: "Barang", icon: "ArchiveBoxIcon", route: "/barang" },
        { title: "Stok", icon: "RectangleStackIcon", route: "/stok" },
        { title: "Transaksi", icon: "BanknotesIcon", route: "/transaksi" },
      ],
    };
  },
};
</script>
<style lang=""></style>
