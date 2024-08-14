<template>
  <div>
    <div class="flex flex-col w-full h-max gap-4">
      <div class="flex gap-1 text-xs">
        <NuxtLink to="/pembelian" class="text-black/60 hover:text-primary"
          >Pembelian
        </NuxtLink>
        <div class="text-primary">/ Tambah Penjualan</div>
      </div>
      <div class="text-primary font-semibold text-2xl">Tambah Penjualan</div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
      <!-- content section -->
      <div class="flex flex-col md:flex-row w-full gap-4">
        <!-- select dropdown -->
        <div class="flex flex-col w-full md:w-1/4 gap-2 justify-end">
          <Label class="text-primary">Nama Produk</Label>
          <v-select
            class="capitalized"
            v-model="selected"
            :options="listBarang"
            label="name">
            <template #selected-option="{ name }">
              <div style="text-transform: capitalize">{{ name }}</div>
            </template>
            <template #option="{ name }">
              <div style="text-transform: capitalize">{{ name }}</div>
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
            <TableCell>{{ item.name }}</TableCell>
            <TableCell>{{
              useFormat.currencyFormat(item.selling_price)
            }}</TableCell>
            <TableCell>{{ item.quantity }}</TableCell>
            <TableCell>{{
              useFormat.currencyFormat(item.total_price)
            }}</TableCell>
            <TableCell
              ><TrashIcon
                class="text-red w-6"
                @click="hapusItem(item.index)"></TrashIcon
            ></TableCell>
          </TableRow>
        </TableBody>
        <div class="text-sm">
          Total Pembelian: {{ useFormat.currencyFormat(finalPrice) }}
        </div>
      </Table>
      <div class="flex w-full justify-end gap-4">
        <Button class="w-max bg-red text-white" @click="this.$router.push('/')">
          Kembali
        </Button>
        <Dialog>
          <DialogTrigger>
            <Button class="bg-primary text-white">Simpan</Button>
          </DialogTrigger>
          <DialogContent>
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
                  @input="change = true"
                  v-model="payment" />
                <div class="flex justify-between mt-4">
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
  <!-- normal version -->
  <div class="hidden" id="print-nota">
    <div style="font-size: 13px" class="font-monospace mx-auto p-0">
      <!-- comment this to pelit version -->
      <div
        class="d-flex flex-column align-items-center mb-3 pb-4"
        style="border-bottom: 1px dashed">
        <div>PT. Acme Indonesia</div>
        <div>Jalan Sana-Sini No.13</div>
      </div>
      <!--  -->
      <div class="mb-3" style="border-bottom: 1px dashed">
        <table class="table table-borderless table-sm">
          <tbody style="font-size: 13px">
            <tr>
              <td>No. Nota</td>
              <td>: {{ returnBeli.nota_id }}</td>
            </tr>
            <tr>
              <td>Waktu</td>
              <td>: {{ useFormat.receiptDateFormat(returnBeli.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mb-3" style="border-bottom: 1px dashed">
        <table class="table table-borderless table-sm">
          <tbody style="font-size: 13px">
            <tr v-for="items in returnBeli.items" :key="items.index">
              <td>{{ items.quantity }}x</td>
              <td class="text-capitalize">{{ items.name }}</td>
              <td class="text-end">
                {{ useFormat.currencyFormat(items.total_price) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mb-6 d-flex justify-content-end">
        <table>
          <tbody>
            <tr>
              <td>TOTAL</td>
              <td>: {{ useFormat.currencyFormat(returnBeli.final_price) }}</td>
            </tr>
            <tr>
              <td>BAYAR</td>
              <td>: {{ useFormat.currencyFormat(returnBeli.payment) }}</td>
            </tr>
            <tr>
              <td>KEMBALI</td>
              <td>: {{ useFormat.currencyFormat(returnBeli.changes) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="d-flex flex-column align-items-center mb-4"
        style="font-size: 13px">
        <div>Powered by</div>
        <div>kasirgue.com</div>
      </div>
      <!-- uncomment below for pelit version -->
      <!-- <div
        class="d-flex flex-column align-items-center mb-3 pb-4"
        style="border-bottom: 1px dashed"
      >
        <div>PT. Acme Indonesia</div>
        <div>Jalan Sana-Sini No.14</div>
      </div> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { usePaperizer } from "paperizer";
import { useUseToast } from "@/stores/useToast";
import { useEnvStore } from "@/stores/envStore";
import { useUseFormat } from "@/stores/useFormat";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/vue/24/solid";
import CurrencyInput from "@/components/currency-input.vue";
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
    TrashIcon,
    PulseLoader,
  },
  data() {
    return {
      loading: false,
      change: false,
      loadingColor: "#ffffff",
      loadingSize: "5px",
      listBarang: [],
      selected: "",
      transStore: [],
      isFilled: false,
      showTable: false,
      harga_beli: null,
      jumlah: null,
      finalPrice: null,
      payment: null,
      moneyList: [10000, 20000, 50000, 100000],
      returnBeli: [],
    };
  },
  methods: {
    addToTransStore() {
      let tempStore = {
        name: this.selected.name,
        product_id: this.selected.id,
        selling_price: this.selected.selling_price,
        quantity: this.jumlah,
        total_price: this.selected.selling_price * this.jumlah,
      };
      this.transStore.push(tempStore);
      const createIndex = this.transStore.map((obj, index) => ({
        ...obj,
        index: index + 1,
      }));
      const finalPrice = this.transStore.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total_price;
      }, 0);
      this.finalPrice = finalPrice;
      this.transStore = createIndex;
      this.showTable = true;
      this.jumlah = null;
      this.selected = "";
      this.isFilled = true;
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
    async getBarangList() {
      try {
        const barang = await axios.get(
          useEnvStore().apiUrl + "/api/product-master"
        );
        this.listBarang = barang.data.data;
      } catch (err) {
        console.log(err);
      }
    },
    async tambahPembelian() {
      this.loading = true;
      const idNota = moment().format("YYYY" + "MM" + "DD" + "HH" + "mm" + "ss");
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
          })
          .then((res) => {
            this.returnBeli = res.data.data;
            console.log(this.returnBeli);
          });
        this.printFunction();
        this.isFilled = false;
        this.transStore = [];
        this.showTable = false;
        this.loading = false;
        this.payment = null;
        // this.$router.push("/");
      } catch (err) {
        console.log(err);
        this.loading = false;
        if (err.response.status === 400) {
          if (err.response.data.message === "Data Creation Failed") {
            useUseToast().emptyStock("Stock tidak mencukupi/ habis.");
          } else {
            const error = err.response.data.error[0].message;
            useUseToast().emptyStock(error);
          }
        }
      }
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
