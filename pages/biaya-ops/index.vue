<template>
  <div class="flex flex-col w-full h-max gap-4">
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Biaya Operasional</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
    <!-- content -->
    <div class="flex flex-col md:flex-row gap-4 justify-end">
      <div class="flex mr-auto justify-between">
        <div class="w-1/5">
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" class="text-primary font-semibold"
                >Filter Tanggal</Button
              >
            </PopoverTrigger>
            <PopoverContent class="flex flex-col w-full border-primary gap-2">
              <div class="flex gap-2">
                <div class="flex flex-col w-36">
                  <div class="text-xs">Tanggal Awal</div>
                  <VueDatePicker
                    v-model="startDate"
                    auto-apply
                    :format="dpFormat"
                    model-type="yyyy-MM-dd"></VueDatePicker>
                </div>
                <div class="flex flex-col w-36">
                  <div class="text-xs">Tanggal Akhir</div>
                  <VueDatePicker
                    v-model="endDate"
                    auto-apply
                    :format="dpFormat"
                    model-type="yyyy-MM-dd"></VueDatePicker>
                </div>
              </div>
              <Button class="bg-primary text-white" @click="getByDate()">
                <div v-if="filterLoading">
                  <PulseLoader
                    :color="filterLoadingColor"
                    :size="filterLoadingSize">
                  </PulseLoader>
                </div>
                <div v-else>Submit</div>
              </Button>
              <Button class="bg-secondary text-white" @click="getKasTx()">
                Reset
              </Button>
            </PopoverContent>
          </Popover>
        </div>
        <div class="w-1/5">
          <xlsx-workbook>
            <xlsx-sheet :collection="dataToExport" :sheet-name="sheetName" />
            <xlsx-download :filename="fileName">
              <Button class="flex bg-primary text-white items-center gap-2">
                <FolderArrowDownIcon class="size-6"></FolderArrowDownIcon>
                Export
              </Button>
            </xlsx-download>
          </xlsx-workbook>
        </div>
      </div>
      <!-- <v-select
        class="w-full md:w-1/6"
        :options="typeList"
        label="type"
        v-model="selectFilterType"
        :input="filterType()"></v-select> -->
      <Input
        v-model="searchValue"
        class="w-full md:w-1/5 text-xs border-black/30 focus-visible:ring-primary"
        placeholder="Cari Keterangan Biaya" />
      <!-- add item -->
      <Dialog>
        <DialogTrigger as-child>
          <Button
            class="flex align-center bg-primary mb-4"
            @click="
              limitWarn = 'Maksimal ' + useUseFormat().currencyFormat(limit)
            ">
            <PlusIcon class="w-6 text-white" />
            <div class="text-white">Tambah Biaya Operasional</div>
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:w-max-md">
          <DialogHeader>
            <DialogTitle> Tambah Transaksi Kas </DialogTitle>
          </DialogHeader>
          <div class="flex items-center space-x-2">
            <div class="grid flex-1 gap-2">
              <Label>Jenis</Label>
              <Input v-model="type" disabled />
              <Label>Jumlah</Label>
              <CurrencyInput
                class="border-black/30 focus-visible:ring-primary flex h-9 w-full rounded-md border border-slate-200 border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                :options="{ currency: 'IDR', locale: 'id-ID' }"
                @blur="limitControl()"
                v-model="amount" />
              <span
                v-if="limitShow"
                class="text-sm italic"
                :class="showLimitClass"
                >{{ limitWarn }}</span
              >
              <Label>Deskripsi</Label>
              <Textarea
                class="border-black/30 focus-visible:ring-primary"
                v-model="deskripsi" />
            </div>
          </div>
          <DialogFooter class="sm:justify-around">
            <DialogClose as-child>
              <div class="flex justify-around gap-6">
                <Button
                  class="bg-red text-white"
                  @click="(amount = null), (periode = null), (deskripsi = null)"
                  >Tutup</Button
                >
                <Button class="bg-primary text-white" @click="submitKas()">
                  Simpan
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    <EasyDataTable
      :headers="headers"
      :items="kasList"
      :search-value="searchValue"
      :search-field="searchField"
      :loading="loading"
      :theme-color="color">
      <template #item-date="item" v-slot:item.date="{ item }">
        <div>{{ useFormat.dateFormat(item.date) }}</div>
      </template>
      <template #item-amount="item" v-slot:item.amount="{ item }">
        <div>{{ useFormat.currencyFormat(item.amount) }}</div>
      </template>
    </EasyDataTable>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { useEnvStore } from "@/stores/envStore";
import { useUseFormat } from "@/stores/useFormat";
import { useUseToast } from "@/stores/useToast";
import { FolderArrowDownIcon, PlusIcon } from "@heroicons/vue/24/solid";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Textarea } from "@/components/ui/textarea";
import { VisuallyHidden } from "radix-vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import {
  XlsxWorkbook,
  XlsxSheet,
  XlsxDownload,
} from "vue3-xlsx/dist/vue3-xlsx.cjs.prod";

export default {
  setup() {
    useSeoMeta({
      title: "Biaya Operasional | Kasirgue",
    });
    const useFormat = useUseFormat();
    return { useFormat };
  },
  components: {
    PlusIcon,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Popover,
    PopoverContent,
    PopoverTrigger,
    PulseLoader,
    VisuallyHidden,
    Textarea,
    VueDatePicker,
    FolderArrowDownIcon,
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
  },
  data() {
    return {
      loading: true,
      searchValue: "",
      searchField: "description",
      // typeList: [],
      selectFilterType: null,
      type: "Biaya Operasional",
      amount: null,
      deskripsi: null,
      limitWarn: "",
      limit: null,
      limitShow: true,
      showLimitClass: "",
      filterLoading: false,
      filterLoadingColor: "#ffffff",
      filterLoadingSize: "5px",
      headers: [
        { text: "Tanggal", value: "date", fixed: true },
        { text: "Jumlah", value: "amount" },
        { text: "Deskripsi", value: "description" },
      ],
      kasList: [],
      defaultKasList: [],
      color: "#0b324f",
      startDate: "",
      endDate: "",
      dpFormat: (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return day + "-" + month + "-" + year;
      },
      dataToExport: null,
      sheetName: "Biaya Operasional",
      fileName: "Biaya Operasional_" + moment().format("D-M-YYYY") + ".xlsx",
    };
  },
  methods: {
    async getKasTx() {
      try {
        const tx = await axios.get(useEnvStore().apiUrl + "/api/kas-tx");
        this.kasList = tx.data.data.kasData;
        this.defaultKasList = tx.data.data.kasData;
        this.limit = tx.data.data.limit;
        this.dataToExport = tx.data.data.kasData.map((item) => ({
          Deskripsi: item.description,
          Tanggal: useUseFormat().dateFormat(item.date),
          Jumlah: useUseFormat().currencyFormat(item.amount),
        }));
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async getByDate() {
      this.filterLoading = true;
      try {
        const tx = await axios.post(
          useEnvStore().apiUrl + "/api/report/kas-tx/date",
          {
            startDate: this.startDate,
            endDate: this.endDate,
          }
        );
        this.kasList = tx.data.data;
        this.dataToExport = tx.data.data.map((item) => ({
          Deskripsi: item.description,
          Tanggal: useUseFormat().dateFormat(item.date),
          Jumlah: useUseFormat().currencyFormat(item.amount),
        }));
        this.filterLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    // async getKasType() {
    //   try {
    //     const types = await axios.get(useEnvStore().apiUrl + "/api/kas-option");
    //     this.typeList = types.data.data;
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
    // showLimit() {
    //   if (this.type === null) {
    //     this.limitShow = false;
    //   } else {
    //     const selectedLimit = this.type.limit;
    //     this.limit = "Maksimal " + useUseFormat().currencyFormat(selectedLimit);
    //     this.limitShow = true;
    //   }
    // },
    limitControl() {
      if (this.amount > this.limit) {
        this.showLimitClass = "text-red";
      } else {
        this.showLimitClass = "text-black";
      }
    },
    filterType() {
      if (this.selectFilterType === null) {
        this.kasList = this.defaultKasList;
        return;
      } else {
        this.kasList = this.defaultKasList.filter(
          (items) => items.type === this.selectFilterType.type
        );
      }
    },
    async submitKas() {
      if (this.amount > this.limit) {
        useUseToast().emptyStock("Limit Kas Terlampaui");
        this.amount = null;
        this.deskripsi = null;
        this.showLimitClass = "";
      } else {
        try {
          const submit = await axios.post(
            useEnvStore().apiUrl + "/api/kas-tx",
            {
              date: moment(),
              description: this.deskripsi,
              amount: this.amount,
              type: this.type,
            }
          );
          console.log(submit);
          this.amount = null;
          this.deskripsi = null;
          this.showLimitClass = "";
          useUseToast().addToast();
          this.getKasTx();
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
  mounted() {
    this.getKasTx();
    // this.getKasType();
  },
};
</script>

<style lang="scss" scoped></style>
