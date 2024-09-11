<template>
  <div>
    <div v-if="loading" class="flex flex-col w-full h-max gap-4">
      <svg
        class="mx-auto animate-[pulse_0.75s_infinite] h-10 w-10 rounded-full bg-primary"
        viewBox="0 0 24 24"></svg>
    </div>
    <div v-else class="flex flex-col w-full h-max gap-4">
      <!-- header -->
      <div class="flex gap-1 text-xs">
        <NuxtLink to="/supplier" class="text-black/60 hover:text-primary"
          >Supplier
        </NuxtLink>
        <div class="text-primary capitalize">/ {{ dataSupplier.nama }}</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Detail Supplier</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- content -->
      <div class="flex flex-col">
        <Table>
          <TableBody>
            <TableRow class="border-b border-black/10">
              <TableCell class="w-1/3">Nama</TableCell>
              <TableCell class="capitalize"
                >: {{ dataSupplier.nama }}</TableCell
              >
            </TableRow>
            <TableRow class="border-b border-black/10">
              <TableCell class="w-1/3">Harga Beli</TableCell>
              <TableCell> : {{ dataSupplier.alamat }} </TableCell>
            </TableRow>
            <TableRow class="border-b border-black/10">
              <TableCell class="w-1/3">Harga Jual</TableCell>
              <TableCell> : {{ dataSupplier.cp }} </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="flex w-1/10 mx-auto gap-6">
        <NuxtLink :to="/supplier/ + 'edit/' + dataSupplier.id" class="w-1/2">
          <Button class="bg-secondary text-white">Edit</Button>
        </NuxtLink>
        <Button class="w-1/2 bg-red text-white" @click="showDelDialog()">
          Hapus
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUseToast } from "@/stores/useToast";
import { useEnvStore } from "@/stores/envStore";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
export default {
  setup() {
    useSeoMeta({
      title: "Detail Barang | Kasirgue",
    });
    const useFormat = useUseFormat();
    return { useFormat };
  },
  components: {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Button,
  },
  data() {
    return {
      dataSupplier: [],
      loading: true,
    };
  },
  methods: {
    showDelDialog() {
      const { $swal } = useNuxtApp();
      $swal
        .fire({
          title: "Peringatan!",
          text: "Apakah anda yakin akan menghapus barang ini? Perubahan tidak dapat dikembalikan.",
          icon: "warning",
          showDenyButton: true,
          confirmButtonText: "Yakin",
          denyButtonText: "Tidak",
          confirmButtonColor: "#0B324F",
          denyButtonColor: "#E84545",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.hapusSupplier();
          } else if (result.isDenied) {
            return;
          }
        });
    },
    async getDataSupplier() {
      try {
        const supplier = await axios.get(
          useEnvStore().apiUrl + "/api/supplier/" + this.$route.params.id
        );
        console.log(supplier);
        this.dataSupplier = supplier.data.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async hapusSupplier() {
      try {
        const hapus = await axios.delete(
          useEnvStore().apiUrl + "/api/supplier/" + this.$route.params.id
        );
        useUseToast().deleteToast();
        this.$router.push("/supplier");
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getDataSupplier();
  },
};
</script>

<style lang="scss" scoped></style>
