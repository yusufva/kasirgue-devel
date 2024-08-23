<template>
  <div>
    <div class="flex flex-col w-full h-max gap-4">
      <div class="flex gap-1 text-xs">
        <NuxtLink to="/supplier" class="text-black/60 hover:text-primary"
          >Supplier
        </NuxtLink>
        <div class="text-primary">/ Tambah Supplier</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Tambah Supplier</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- input section -->
      <div class="flex flex-col md:flex-row w-full gap-4">
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Nama Supplier</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary capitalize"
            v-model="nama_supplier" />
        </div>
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Alamat</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary capitalize"
            v-model="alamat" />
        </div>
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Contact Person</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary capitalize"
            v-model="contact_person" />
        </div>
      </div>
      <div class="flex w-full justify-end gap-4">
        <Button
          class="w-max bg-red text-white"
          @click="this.$router.push('/barang')">
          Kembali
        </Button>
        <Button class="w-max bg-primary text-white" @click="tambahSupplier()">
          <div v-if="loading">
            <PulseLoader
              :color="loadingColor"
              :size="loadingSize"></PulseLoader>
          </div>
          <div v-else>Tambah</div>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useUseToast } from "@/stores/useToast";
import { useEnvStore } from "@/stores/envStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
export default {
  setup() {
    useSeoMeta({
      title: "Tambah Supplier | Kasirgue",
    });
  },
  components: {
    Input,
    Label,
    Button,
    PulseLoader,
  },
  data() {
    return {
      loading: false,
      loadingColor: "#ffffff",
      loadingSize: "5px",
      nama_supplier: "",
      alamat: null,
      contact_person: null,
    };
  },
  methods: {
    async tambahSupplier() {
      this.loading = true;
      try {
        const supplier = await axios.post(
          useEnvStore().apiUrl + "/api/supplier",
          {
            name: this.nama_supplier.toLowerCase(),
            alamat: this.alamat,
            cp: this.contact_person,
          }
        );
        useUseToast().addToast();
        this.$router.push("/supplier");
      } catch (err) {
        if (err.response.status === 400) {
          this.loading = false;
          useUseToast().formNotCompleted();
        }
        if (err.response.status === 409) {
          this.loading = false;
          useUseToast().sameProductName();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
