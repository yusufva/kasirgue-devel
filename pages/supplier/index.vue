<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Daftar Supplier</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
    <div class="flex gap-4 mb-4 justify-between md:justify-end">
      <Input
        v-model="searchValue"
        class="w-1/2 md:w-1/5 text-xs border-black/30 focus-visible:ring-primary"
        placeholder="Cari Supplier" />
      <NuxtLink to="/supplier/tambah">
        <PlusCircleIcon class="w-8 text-primary" />
      </NuxtLink>
    </div>
    <EasyDataTable
      :headers="headers"
      :items="supplierList"
      :search-value="searchValue"
      :search-field="searchField"
      :loading="loading"
      :theme-color="color">
      <template #item-nama="item" v-slot:item.nama="{ item }">
        <div class="capitalize">{{ item.nama }}</div>
      </template>
      <template #item-alamat="item" v-slot:item.alamat="{ item }">
        <div class="capitalize">{{ item.alamat }}</div>
      </template>
      <template #item-opsi="item" v-slot:item.opsi="{ item }">
        <NuxtLink :to="/supplier/ + item.id">
          <div class="bg-primary text-white rounded-full p-2 m-1 w-8">
            <ArrowTopRightOnSquareIcon />
          </div>
        </NuxtLink>
      </template>
    </EasyDataTable>
  </div>
</template>

<script>
import {
  PlusCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/vue/24/solid";
import { useEnvStore } from "@/stores/envStore";
import { useUseFormat } from "@/stores/useFormat";
import axios from "axios";
export default {
  setup() {
    useSeoMeta({
      title: "Supplier | Kasirgue",
    });
  },
  components: {
    PlusCircleIcon,
    ArrowTopRightOnSquareIcon,
  },
  data() {
    return {
      loading: true,
      color: "#0b324f",
      headers: [
        { text: "Nama", value: "nama" },
        { text: "Alamat", value: "alamat" },
        { text: "CP", value: "cp" },
        { text: "", value: "opsi" },
      ],
      supplierList: [],
      searchField: "nama",
      searchValue: "",
    };
  },
  methods: {
    async getSupplier() {
      try {
        const supplier = await axios.get(
          useEnvStore().apiUrl + "/api/supplier"
        );
        this.supplierList = supplier.data.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getSupplier();
  },
};
</script>

<style lang="scss" scoped></style>
