<template>
  <div class="flex flex-col w-full h-max gap-4">
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Kas</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
    <!-- content -->
    <div class="flex flex-col md:flex-row gap-4 justify-end">
      <v-select
        class="w-full md:w-1/6"
        :options="typeList"
        label="type"
        v-model="selectFilterType"
        :input="filterType()"></v-select>
      <Input
        v-model="searchValue"
        class="w-full md:w-1/5 text-xs border-black/30 focus-visible:ring-primary"
        placeholder="Cari Keterangan Kas" />
      <!-- add item -->
      <Dialog>
        <DialogTrigger as-child>
          <Button class="flex align-center bg-primary mb-4">
            <PlusIcon class="w-6 text-white" />
            <div class="text-white">Tambah Transaksi Kas</div>
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:w-max-md">
          <DialogHeader>
            <DialogTitle> Tambah Transaksi Kas </DialogTitle>
          </DialogHeader>
          <div class="flex items-center space-x-2">
            <div class="grid flex-1 gap-2">
              <Label>Jenis</Label>
              <v-select
                :options="typeList"
                label="type"
                :input="showLimit()"
                v-model="type" />
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
                >{{ limit }}</span
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
                  @click="(limit = null), (periode = null), (type = null)"
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
import { PlusIcon } from "@heroicons/vue/24/solid";
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

export default {
  setup() {
    useSeoMeta({
      title: "Kas | Kasirgue",
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
    VisuallyHidden,
    Textarea,
  },
  data() {
    return {
      loading: true,
      searchValue: "",
      searchField: "description",
      typeList: [],
      selectFilterType: null,
      type: null,
      amount: null,
      deskripsi: null,
      limit: "",
      limitShow: false,
      showLimitClass: "",
      headers: [
        { text: "Tanggal", value: "date", fixed: true },
        { text: "Jenis Kas", value: "type" },
        { text: "Jumlah", value: "amount" },
        { text: "Deskripsi", value: "description" },
      ],
      kasList: [],
      defaultKasList: [],
      color: "#0b324f",
    };
  },
  methods: {
    async getKasTx() {
      try {
        const tx = await axios.get(useEnvStore().apiUrl + "/api/kas-tx");
        this.kasList = tx.data.data;
        this.defaultKasList = tx.data.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async getKasType() {
      try {
        const types = await axios.get(useEnvStore().apiUrl + "/api/kas-option");
        this.typeList = types.data.data;
      } catch (err) {
        console.log(err);
      }
    },
    showLimit() {
      if (this.type === null) {
        this.limitShow = false;
      } else {
        const selectedLimit = this.type.limit;
        this.limit = "Maksimal " + useUseFormat().currencyFormat(selectedLimit);
        this.limitShow = true;
      }
    },
    limitControl() {
      if (this.amount > this.type.limit) {
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
      if (this.amount > this.type.limit) {
        useUseToast().emptyStock("Limit Kas Terlampaui");
        this.type = null;
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
              type: this.type.type,
            }
          );
          this.type = null;
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
    this.getKasType();
  },
};
</script>

<style lang="scss" scoped></style>
