import { defineStore } from "pinia";

export const useRouteStore = defineStore("route", {
  state: () => ({
    route: [
      { title: "Beranda", icon: "HomeIcon", route: "/" },
      { title: "Barang", icon: "ArchiveBoxIcon", route: "/barang" },
      { title: "Stok", icon: "RectangleStackIcon", route: "/stok" },
      { title: "Supplier", icon: "UsersIcon", route: "/supplier" },
      { title: "Pembelian", icon: "SquaresPlusIcon", route: "/pembelian" },
      { title: "Penjualan", icon: "ShoppingCartIcon", route: "/penjualan" },
      { title: "Laba Rugi", icon: "ArrowsUpDownIcon", route: "/labarugi" },
      { title: "Pengaturan", icon: "Cog6ToothIcon", route: "/pengaturan" },
    ],
  }),
});
