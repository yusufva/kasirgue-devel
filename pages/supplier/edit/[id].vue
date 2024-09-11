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
        <NuxtLink to="/barang" class="text-black/60 hover:text-primary"
          >Supplier
        </NuxtLink>
        <div class="text-primary capitalize">/ {{ dataSupplier.nama }}</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Edit Supplier</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- content -->
      <div class="flex flex-col md:flex-row w-full gap-4">
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Nama Supplier</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary capitalize"
            v-model="nama" />
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
            v-model="cp" />
        </div>
      </div>
      <div class="flex w-full justify-end gap-4">
        <Button
          class="w-max bg-red text-white"
          @click="this.$router.push('/barang')">
          Kembali
        </Button>
        <Button class="w-max bg-primary text-white" @click="editSupplier()">
          <div v-if="loadingSubmit">
            <PulseLoader
              :color="loadingColor"
              :size="loadingSize"></PulseLoader>
          </div>
          <div v-else>Simpan</div>
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
export default {
  setup() {
    useSeoMeta({
      title: "Edit Barang | Kasirgue",
    });
  },
  components: {
    Input,
    PulseLoader,
  },
  data() {
    return {
      loading: false,
      loadingSubmit: false,
      loadingColor: "#ffffff",
      loadingSize: "5px",
      dataSupplier: [],
      loading: true,
      nama: null,
      alamat: null,
      cp: null,
    };
  },
  methods: {
    async getDataSupplier() {
      try {
        const barang = await axios.get(
          useEnvStore().apiUrl + "/api/supplier/" + this.$route.params.id
        );
        console.log(barang);
        this.dataSupplier = barang.data.data;
        this.nama = this.dataSupplier.nama;
        this.alamat = this.dataSupplier.alamat;
        this.cp = this.dataSupplier.cp;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async editSupplier() {
      this.loadingSubmit = true;
      try {
        const edit = await axios.put(
          useEnvStore().apiUrl + "/api/supplier/" + this.$route.params.id,
          {
            name: this.nama.toLowerCase(),
            alamat: this.alamat,
            cp: this.cp,
          }
        );
        useUseToast().editToast();
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
