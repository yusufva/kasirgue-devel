<template>
  <div>
    <div class="flex flex-col w-full h-max gap-4">
      <div class="flex gap-1 text-xs">
        <NuxtLink to="/pembelian" class="text-black/60 hover:text-primary"
          >Penjualan
        </NuxtLink>
        <div class="text-primary">/ Tambah Penjualan</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Tambah Penjualan</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- content section -->

      <!-- custom header -->
      <!-- <div class="flex flex-col md:flex-row w-full gap-4"> -->
      <!-- select header -->
      <!-- <div class="flex flex-col w-full md:w-1/4 gap-2 justify-end">
          <Label class="text-primary">Pilih Header</Label>
          <v-select
            v-model="header"
            :options="headerList"
            label="name"></v-select>
        </div>
      </div> -->
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
          <TableHead>Harga Jual</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Total</TableHead>
        </TableHeader>
        <TableBody class="border-b border-primary">
          <TableRow
            v-for="item in transStore"
            :key="item.id"
            class="borer-b border-black/10 capitalize">
            <TableCell class="flex gap-1">
              <div class="text-capitalize">{{ item.name }}</div>
              <div>({{ item.satuan }})</div>
            </TableCell>
            <TableCell>{{
              useFormat.currencyFormat(item.selling_price)
            }}</TableCell>
            <TableCell>{{ item.quantity }}</TableCell>
            <TableCell>{{
              useFormat.currencyFormat(item.total_price)
            }}</TableCell>
            <TableCell>
              <TrashIcon
                class="text-red w-6"
                @click="hapusItem(item.index)"></TrashIcon>
            </TableCell>
          </TableRow>
        </TableBody>
        <div class="text-sm">
          Total Pembelian: {{ useFormat.currencyFormat(finalPrice) }}
        </div>
      </Table>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col w-full md:w-1/2 gap-2">
          <Label>Keterangan</Label>
          <Input
            class="border-black/30 focus-visible:ring-primary"
            v-model="keterangan" />
        </div>

        <!-- is marketplace -->
        <div class="flex flex-col gap-2">
          <div class="flex gap-1 items-center">
            <Checkbox
              @click="
                (isMarketplace = !isMarketplace),
                  isMarketplace === false
                    ? (fromMarketplace = 0)
                    : fromMarketplace
              "
              class="border-black/30 focus-visible:ring-primary" />
            <Label>Marketplace</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <QuestionMarkCircleIcon class="w-5 text-primary" />
                </TooltipTrigger>
                <TooltipContent
                  class="bg-white outline outline-1 outline-primary">
                  <p>Klik jika penjualan ini dilakukan di marketplace.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div v-if="isMarketplace">
            <Label>Pendapatan dari Marketplace</Label>
            <CurrencyInput
              class="border-black/30 focus-visible:ring-primary flex h-9 w-full md:w-1/4 rounded-md border border-slate-200 border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              :options="{ currency: 'IDR', locale: 'id-ID' }"
              v-model="fromMarketplace" />
          </div>
        </div>
      </div>
      <div class="flex w-full justify-end gap-4">
        <Button class="w-max bg-red text-white" @click="this.$router.push('/')">
          Kembali
        </Button>
        <!-- konfirmasi pembayaran -->
        <Dialog>
          <DialogTrigger>
            <Button class="bg-primary text-white">Simpan</Button>
          </DialogTrigger>
          <DialogContent class="w-11/12">
            <DialogHeader>
              <DialogTitle class="text-red">Teliti Kembali!</DialogTitle>
              <DialogDescription>
                <div class="text-red">
                  <div>Pastikan tidak ada kesalahan pada input penjualan.</div>
                  <div>
                    Data yang sudah tersimpan tidak dapat diubah/ dihapus.
                  </div>
                </div>
                <div class="mt-2 text-lg font-bold">
                  Total Harga: {{ useFormat.currencyFormat(finalPrice) }}
                </div>
                <Label>Masukkan Uang yang dibayarkan</Label>
                <CurrencyInput
                  class="border-black/30 focus-visible:ring-primary flex h-9 w-full rounded-md border border-slate-200 border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  :options="{ currency: 'IDR', locale: 'id-ID' }"
                  v-model="payment"
                  @input="change = true"
                  :disabled="paymentDisable" />
                <Label>Metode Pembayaran</Label>
                <v-select
                  :input="pembayaranControl()"
                  v-model="metodePembayaran"
                  label="name"
                  :clearable="false"
                  :reduce="(metode) => metode.name"
                  :options="metodePembayaranList"></v-select>
                <div class="flex flex-wrap gap-2 justify-between mt-4">
                  <Button
                    v-for="items in moneyList"
                    :key="items.id"
                    @click="(payment = items), (change = true)"
                    class="bg-primary text-white hover:bg-white hover:text-primary"
                    >{{ useFormat.currencyFormat(items) }}</Button
                  >
                </div>
                <div v-if="change" class="text-lg font-bold mt-4">
                  Kembali: {{ useFormat.currencyFormat(payment - finalPrice) }}
                </div>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose>
                <Button
                  class="w-max bg-primary text-white"
                  @click="tambahPembelian()">
                  <div v-if="loading">
                    <PulseLoader
                      :color="loadingColor"
                      :size="loadingSize"></PulseLoader>
                  </div>
                  <div v-else>Simpan</div>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div>

  <!-- receipt print section -->
  <PrintNota class="hidden" id="print-nota" :returnBeli="returnBeli" />
</template>

<script>
import axios from "axios";
import moment from "moment";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { usePaperizer } from "paperizer";
import { useUseToast } from "@/stores/useToast";
import { useEnvStore } from "@/stores/envStore";
import { useAuthStore } from "@/stores/authStore";
import { useUseFormat } from "@/stores/useFormat";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrashIcon, QuestionMarkCircleIcon } from "@heroicons/vue/24/solid";
import CurrencyInput from "@/components/currency-input.vue";
import PrintNota from "@/components/nota-print-area.vue";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default {
  setup() {
    useSeoMeta({
      title: "Tambah Penjualan | Kasirgue",
    });
    const useFormat = useUseFormat();
    return { useFormat };
  },
  components: {
    Input,
    Label,
    Button,
    CurrencyInput,
    Checkbox,
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableCell,
    TableRow,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    PrintNota,
    TrashIcon,
    QuestionMarkCircleIcon,
    PulseLoader,
  },
  data() {
    return {
      loading: false,
      error: "",
      change: false,
      isMarketplace: false,
      fromMarketplace: null,
      keterangan: "",
      loadingColor: "#ffffff",
      loadingSize: "5px",
      metodePembayaran: "Cash",
      metodePembayaranList: [],
      listBarang: [],
      selected: null,
      transStore: [],
      isFilled: false,
      showTable: false,
      harga_beli: null,
      jumlah: null,
      finalPrice: null,
      payment: 0,
      paymentDisable: false,
      moneyList: [10000, 20000, 50000, 100000],
      returnBeli: [],
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
        let tempStore = {
          name: this.selected.name,
          product_id: this.selected.id,
          selling_price: this.selected.selling_price,
          quantity: this.jumlah,
          satuan: this.selected.stock.satuan.kd_satuan,
          total_price: this.selected.selling_price * this.jumlah,
        };
        console.log(tempStore);
        this.transStore.push(tempStore);
        const createIndex = this.transStore.map((obj, index) => ({
          ...obj,
          index: index + 1,
        }));
        const finalPrice = this.transStore.reduce(
          (accumulator, currentValue) => {
            return accumulator + currentValue.total_price;
          },
          0
        );
        this.finalPrice = finalPrice;
        this.transStore = createIndex;
        this.showTable = true;
        this.error = "";
        this.jumlah = null;
        this.selected = null;
        this.isFilled = true;
      }
    },
    hapusItem(index) {
      const indexToRemove = index;
      const removedIndex = this.transStore.filter(
        (obj) => obj.index !== indexToRemove
      );
      this.transStore = removedIndex;
      const finalPrice = this.transStore.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total_price;
      }, 0);
      this.finalPrice = finalPrice;
      const total_bayar = this.transStore.reduce(
        (total, obj) => total + obj.total_harga,
        0
      );
      this.totalBayar = total_bayar;
    },
    pembayaranControl() {
      if (this.metodePembayaran === "Cash") {
        this.paymentDisable = false;
      } else {
        this.paymentDisable = true;
        this.payment = this.finalPrice;
      }
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
    async getPembayaranList() {
      try {
        const pembayaran = await axios.get(
          useEnvStore().apiUrl + "/api/payment-types"
        );
        this.metodePembayaranList = pembayaran.data.data;
      } catch (err) {
        console.log(err);
      }
    },
    async tambahPembelian() {
      this.loading = true;
      if (this.transStore.length === 0) {
        useUseToast().noItem();
        this.loading = false;
      } else {
        const idNota = moment().format(
          "YYYY" + "MM" + "DD" + "HH" + "mm" + "ss"
        );
        const itemToPost = this.transStore.map(({ index, ...rest }) => rest);
        try {
          const beli = await axios
            .post(useEnvStore().apiUrl + "/api/tx-sell", {
              date: moment(),
              nota_id: idNota,
              items: itemToPost,
              final_price: this.finalPrice,
              payment: this.payment,
              changes: this.payment - this.finalPrice,
              payment_note: this.keterangan,
              payment_type: this.metodePembayaran,
              admin_cut:
                this.isMarketplace === false
                  ? 0
                  : this.finalPrice - this.fromMarketplace,
            })
            .then((res) => {
              this.returnBeli = res.data.data;
            });
          this.printFunction();
          this.transStore = [];
          this.isFilled = false;
          this.showTable = false;
          this.finalPrice = null;
          this.loading = false;
          this.payment = null;
          this.keterangan = "";
          this.fromMarketplace = 0;
          this.metodePembayaran = "Cash";
          // this.$router.push("/");
        } catch (err) {
          console.log(err);
          this.loading = false;
          if (err.response.status === 400) {
            this.isFilled = true;
            if (err.response.data.message === "Data Creation Failed") {
              useUseToast().emptyStock("Stock tidak mencukupi/ habis.");
            } else {
              const error = err.response.data.error[0].message;
              useUseToast().emptyStock(error);
            }
          }
        }
      }
    },
    barangDropdownOpen(VueSelect) {
      if (this.selected !== null) {
        return VueSelect.open;
      }
      return VueSelect.search.length !== 0 && VueSelect.open;
    },
    printCallback() {
      const { $swal } = useNuxtApp();
      $swal
        .fire({
          text: "Apakah anda ingin mencetak nota lagi?",
          showDenyButton: true,
          confirmButtonText: "Cetak",
          denyButtonText: "Tidak",
          confirmButtonColor: "#0B324F",
          denyButtonColor: "#E84545",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.printFunction();
          } else if (result.isDenied) {
            return;
          }
        });
    },
    printFunction() {
      const { paperize } = usePaperizer(
        "print-nota",
        {
          features: ["titlebar=no"],
          styles: [
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
          ],
        },
        this.printCallback()
      );
      paperize();
    },
  },
  mounted() {
    this.getBarangList();
    this.getPembayaranList();
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
