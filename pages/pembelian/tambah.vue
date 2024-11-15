<template>
  <div>
    <div class="flex flex-col w-full h-max gap-4">
      <div class="flex gap-1 text-xs">
        <NuxtLink to="/pembelian" class="text-black/60 hover:text-primary"
          >Pembelian
        </NuxtLink>
        <div class="text-primary">/ Tambah Pembelian</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Tambah Pembelian</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- content section -->
      <div class="flex flex-row w-full gap-4">
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Nomor Nota</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary"
            v-model="idNota" />
        </div>
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Supplier</Label>
          <v-select
            class="border-black/30 focus-visible:ring-primary capitalize"
            :options="listSupplier"
            label="nama"
            :reduce="(supplier) => supplier.id"
            :dropdown-should-open="barangDropdownOpen"
            v-model="supplier" />
        </div>
      </div>
      <div class="flex flex-col md:flex-row w-full gap-4">
        <!-- select dropdown -->
        <div class="flex flex-col w-full md:w-1/4 gap-2 justify-end">
          <Label class="text-primary">Nama Produk</Label>
          <v-select
            class="capitalized"
            v-model="selected"
            :options="listBarang"
            label="name"
            :dropdown-should-open="barangDropdownOpen">
            <template #selected-option="{ name, stock }">
              <div style="text-transform: capitalize">
                {{ name }} ({{ stock.satuan.kd_satuan }})
              </div>
            </template>
            <template #option="{ name, stock }">
              <div style="text-transform: capitalize">
                {{ name }} ({{ stock.satuan.kd_satuan }})
              </div>
            </template>
            <template #no-options="{ searching, search }">
              <template v-if="searching">
                <div style="opacity: 0.5">
                  Barang <em>{{ search }}</em> tidak ditemukan.
                </div>
              </template>
            </template>
          </v-select>
        </div>
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Harga Beli</Label>
          <CurrencyInput
            class="border-black/30 focus-visible:ring-primary flex h-9 w-full rounded-md border border-slate-200 border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
            :options="{ currency: 'IDR', locale: 'id-ID' }"
            v-model="harga_beli" />
        </div>
        <div class="flex flex-col w-full md:w-1/4 gap-2">
          <Label class="text-primary">Jumlah</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary"
            type="number"
            v-model="jumlah" />
        </div>
        <div class="flex flex-col justify-end w-1/4 gap-2">
          <Button
            class="w-max bg-primary text-white"
            @click="addToTransStore()">
            Tambah
          </Button>
        </div>
      </div>
      <div class="text-red text-xs -mt-4">
        {{ error }}
      </div>
      <!-- table content -->
      <Table v-if="showTable">
        <TableHeader class="border-b border-primary">
          <TableHead>Barang</TableHead>
          <TableHead>Harga Beli</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Total</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="item in transStore"
            :key="item.id"
            class="borer-b border-black/10 capitalize">
            <TableCell>{{ item.name }}</TableCell>
            <TableCell>{{
              useFormat.currencyFormat(item.buying_price)
            }}</TableCell>
            <TableCell>{{ item.quantity }}</TableCell>
            <TableCell>{{
              useFormat.currencyFormat(item.total_price)
            }}</TableCell>
            <TableCell>
              <TrashIcon
                class="text-red w-6 cursor-pointer"
                @click="hapusItem(item.index)"></TrashIcon>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div class="flex w-full justify-end gap-4">
        <Button
          class="w-max bg-red text-white"
          @click="this.$router.push('/pembelian')">
          Kembali
        </Button>
        <Dialog>
          <DialogTrigger as-child>
            <Button class="w-max bg-primary text-white">
              <div v-if="loading">
                <PulseLoader
                  :color="loadingColor"
                  :size="loadingSize"></PulseLoader>
              </div>
              <div v-else>Simpan</div>
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:w-max-md">
            <DialogHeader>
              <VisuallyHidden>
                <DialogTitle></DialogTitle>
              </VisuallyHidden>
            </DialogHeader>
            <div class="mx-auto">
              Apakah anda yakin ingin menambahkan pembelian ini?
            </div>
            <DialogFooter class="sm:justify-around">
              <DialogClose as-child>
                <div class="flex justify-around gap-6">
                  <Button class="bg-red text-white">Tidak</Button>
                  <Button
                    class="bg-primary text-white"
                    @click="tambahPembelian()">
                    Yakin
                  </Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import CurrencyInput from "@/components/currency-input.vue";
import { useUseToast } from "@/stores/useToast";
import { useEnvStore } from "@/stores/envStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-vue";
import { TrashIcon } from "@heroicons/vue/24/solid";
export default {
  setup() {
    useSeoMeta({
      title: "Tambah Pembelian | Kasirgue",
    });
    const useFormat = useUseFormat();
    return { useFormat };
  },
  components: {
    Input,
    CurrencyInput,
    Label,
    Button,
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableCell,
    TableRow,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    VisuallyHidden,
    PulseLoader,
    TrashIcon,
  },
  data() {
    return {
      loading: false,
      error: "",
      loadingColor: "#ffffff",
      loadingSize: "5px",
      listBarang: [],
      selected: null,
      transStore: [],
      showTable: false,
      idNota: null,
      harga_beli: null,
      jumlah: null,
      listSupplier: [],
      supplier: null,
      isFilled: false,
    };
  },
  methods: {
    addToTransStore() {
      if (this.selected === null) {
        this.error = "Tidak ada barang yang dipilih";
        return;
      }
      if (this.jumlah === null || this.jumlah === 0) {
        this.error = "Jumlah barang belum diisi";
        return;
      } else {
        this.selectedId = this.selected.id;
        let tempStore = {
          name: this.selected.name,
          product_id: this.selected.id,
          buying_price: this.harga_beli,
          quantity: this.jumlah,
          total_price: this.harga_beli * this.jumlah,
        };
        const checkExisting = this.transStore.find(
          (item) => item.product_id === tempStore.product_id
        );
        // check apakah barang sudah berada dalam list
        if (checkExisting) {
          checkExisting.quantity += tempStore.quantity;
          checkExisting.total_price =
            checkExisting.buying_price * checkExisting.quantity;
          const finalPrice = this.transStore.reduce(
            (accumulator, currentValue) => {
              return accumulator + currentValue.total_price;
            },
            0
          );
          this.finalPrice = finalPrice;
          this.error = "";
          this.jumlah = null;
          this.selected = null;
          return;
        } else {
          this.transStore.push(tempStore);
          const createIndex = this.transStore.map((obj, index) => ({
            ...obj,
            index: index + 1,
          }));
          this.transStore = createIndex;
          this.selected = null;
          this.harga_beli = null;
          this.jumlah = null;
          this.showTable = true;
          this.isFilled = true;
          this.isTambah = true;
          console.log(this.transStore);
        }
      }
    },
    hapusItem(index) {
      const indexToRemove = index;
      const removedIndex = this.transStore.filter(
        (obj) => obj.index !== indexToRemove
      );
      this.transStore = removedIndex;
    },
    async getBarangList() {
      try {
        const barang = await axios.get(
          useEnvStore().apiUrl + "/api/product-master"
        );
        this.listBarang = barang.data.data;
        console.log(this.listBarang);
      } catch (err) {
        console.log(err);
      }
    },
    async getSupplierList() {
      try {
        const supplier = await axios.get(
          useEnvStore().apiUrl + "/api/supplier"
        );
        this.listSupplier = supplier.data.data;
      } catch (err) {
        console.log(err);
      }
    },
    async tambahPembelian() {
      this.loading = true;
      const finalPrice = this.transStore.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total_price;
      }, 0);
      const itemToPost = this.transStore.map(({ index, ...rest }) => rest);
      try {
        const beli = await axios.post(useEnvStore().apiUrl + "/api/tx-buy", {
          date: moment(),
          nota_id: this.idNota,
          supplier_id: this.supplier,
          items: itemToPost,
          final_price: finalPrice,
        });
        this.isFilled = false;
        useUseToast().addToast();
        this.$router.push("/pembelian");
      } catch (err) {
        console.log(err);
        if (err.response.status === 400 || err.response.status === 500) {
          useUseToast().formNotCompleted();
          this.loading = false;
        }
      }
    },
    barangDropdownOpen(VueSelect) {
      if (this.selected !== null && this.supplier !== null) {
        return VueSelect.open;
      }
      return VueSelect.search.length !== 0 && VueSelect.open;
    },
  },
  mounted() {
    this.getBarangList();
    this.getSupplierList();
  },
  beforeRouteLeave(to, from, next) {
    if (this.isFilled === true) {
      const { $swal } = useNuxtApp();

      $swal
        .fire({
          title: "Peringatan!",
          text: "Apakah anda yakin meninggalkan halaman ini? Perubahan tidak akan tersimpan.",
          icon: "warning",
          showDenyButton: true,
          confirmButtonText: "Yakin",
          denyButtonText: "Tidak",
          confirmButtonColor: "#0B324F",
          denyButtonColor: "#E84545",
        })
        .then((result) => {
          if (result.isConfirmed) {
            next();
          } else if (result.isDenied) {
            next(false);
          }
        });
    } else {
      next();
    }
  },
};
</script>

<style lang="scss" scoped></style>
