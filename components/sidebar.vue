<template lang="">
  <div>
    <Sheet>
      <div class="flex p-4 gap-2 items-baseline">
        <img :src="logo" class="w-[100px]" />
        <SheetTrigger>
          <ChevronDoubleRightIcon class="text-primary w-6" />
        </SheetTrigger>
        <div v-for="item in links" :key="item.index">
          <component :is="item.icon"></component>
          <HomeIcon />
        </div>
      </div>
      <SheetContent side="left" class="flex p-4 w-1/4 bg-white border-none">
        <SheetHeader>
          <SheetTitle class="flex justify-center my-4">
            <img :src="logo" class="w-1/2" />
          </SheetTitle>
          <SheetDescription class="flex flex-col items-center">
            <div v-for="item in links" :key="item.index" class="w-2/3 h-max">
              <NuxtLink :to="item.route">
                <SheetClose>
                  <Card class="border-none shadow-none">
                    <CardContent>
                      <CardDescription class="flex font-semibold text-primary">
                        <component :is="item.icon"></component>{{ item.title }}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </SheetClose>
              </NuxtLink>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
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
    BanknotesIcon,
  },
  data() {
    return {
      logo: Logo,
      links: [
        { title: "Beranda", icon: "HomeIcon", route: "/" },
        { title: "Stok", icon: "ArchiveBoxIcon", route: "/stok" },
        { title: "Transaksi", icon: "BanknotesIcon", route: "/transaksi" },
      ],
    };
  },
};
</script>
<style lang=""></style>
