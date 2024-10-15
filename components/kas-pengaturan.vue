<template>
  <div class="flex flex-col w-full m-2">
    <!-- header -->
    <div class="flex flex-col sticky top-0 p-2 bg-white z-10">
      <div class="flex justify-between items-center">
        <div class="text-primary font-semibold text-xl">Pengaturan Kas</div>
      </div>
      <div class="h-[2px] w-full bg-primary/20 rounded-xl"></div>
    </div>
    <!-- content -->
    <ClipLoader
      v-if="loading"
      class="my-auto"
      color="loadingColor"
      :size="loadingSize" />
    <Table v-else>
      <TableHeader class="sticky top-10 z-0 bg-white">
        <TableHead>Jenis</TableHead>
        <TableHead>Limit</TableHead>
        <TableHead>Periode</TableHead>
        <TableHead></TableHead>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="items in kas"
          :key="items.id"
          class="border-b border-black/10">
          <TableCell>{{ items.type }}</TableCell>
          <TableCell>{{ useFormat.currencyFormat(items.limit) }}</TableCell>
          <TableCell>{{ items.period }}</TableCell>
          <TableCell class="flex gap-2 justify-end">
            <!-- edit item -->
            <Dialog>
              <DialogTrigger as-child>
                <PencilSquareIcon
                  class="w-5 text-secondary cursor-pointer"
                  @click="getKasById(items.id)" />
              </DialogTrigger>
              <DialogContent class="sm:w-max-md">
                <DialogHeader>
                  <DialogTitle> Ubah Satuan </DialogTitle>
                </DialogHeader>
                <div class="flex items-center space-x-2">
                  <div class="grid flex-1 gap-2">
                    <Label>Limit</Label>
                    <CurrencyInput
                      class="border-black/30 focus-visible:ring-primary flex h-9 w-full rounded-md border border-slate-200 border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                      :options="{ currency: 'IDR', locale: 'id-ID' }"
                      v-model="limit"
                      :disabled="!isLoaded" />
                    <Label>Periode</Label>
                    <v-select
                      :options="periodList"
                      v-model="periode"
                      :disabled="!isLoaded" />
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
                      <Button
                        class="bg-primary text-white"
                        @click="editKas(items.id)">
                        Simpan
                      </Button>
                    </div>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script>
import axios from "axios";
import { useEnvStore } from "@/stores/envStore";
import { useUseToast } from "@/stores/useToast";
import { useUseFormat } from "@/stores/useFormat";
import CurrencyInput from "@/components/currency-input.vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
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
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/solid";
import { VisuallyHidden } from "radix-vue";
export default {
  setup() {
    const useFormat = useUseFormat();
    return { useFormat };
  },
  components: {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
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
    Input,
    CurrencyInput,
    Label,
    ClipLoader,
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon,
  },
  data() {
    return {
      kas: [],
      type: null,
      limit: null,
      periode: null,
      periodList: ["Harian", "Mingguan", "Bulanan"],
      isLoaded: false,
      loading: true,
      loadingColor: "#0B324F",
      loadingSize: "60px",
    };
  },
  methods: {
    async getKas() {
      try {
        const kas = await axios.get(useEnvStore().apiUrl + "/api/kas-option");
        console.log(kas);
        this.kas = kas.data.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async getKasById(id) {
      try {
        const satuan = await axios.get(
          useEnvStore().apiUrl + "/api/kas-option/" + id
        );
        this.type = satuan.data.data.type;
        this.limit = satuan.data.data.limit;
        this.periode = satuan.data.data.period;
        this.isLoaded = true;
      } catch (err) {
        console.log(err);
      }
    },
    async editKas(id) {
      this.loading = true;
      try {
        const edit = await axios.put(
          useEnvStore().apiUrl + "/api/kas-option/" + id,
          {
            type: this.type,
            limit: this.limit,
            period: this.periode,
          }
        );
        useUseToast().editToast();
        this.type = null;
        this.limit = null;
        this.periode = null;
        this.getKas();
      } catch (err) {
        if (err.response.status === 400) {
          useUseToast().formNotCompleted();
          this.loading = false;
        }
      }
    },
  },
  mounted() {
    this.getKas();
  },
};
</script>

<style lang="scss" scoped></style>
