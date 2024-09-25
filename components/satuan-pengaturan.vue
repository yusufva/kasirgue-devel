<template>
  <div class="flex flex-col w-full m-2">
    <!-- header -->
    <div class="flex flex-col sticky top-2 bg-white z-10">
      <div class="flex justify-between items-center">
        <div class="text-primary font-semibold text-xl">Satuan</div>
        <Dialog>
          <DialogTrigger as-child>
            <PlusCircleIcon class="text-primary w-8 cursor-pointer" />
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Satuan</DialogTitle>
            </DialogHeader>
            <div class="flex items-center space-x-2">
              <div class="grid flex-1 gap-2">
                <Label>Nama Satuan</Label>
                <Input v-model="nama" />
                <Label>Simbol</Label>
                <Input v-model="simbol" />
              </div>
            </div>
            <DialogFooter class="sm:justify-around">
              <DialogClose as-child>
                <div class="flex justify-around gap-6">
                  <Button class="bg-red text-white">Tutup</Button>
                  <Button class="bg-primary text-white" @click="addSatuan()">
                    Simpan
                  </Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
        <TableHead>Nama</TableHead>
        <TableHead>Simbol</TableHead>
        <TableHead></TableHead>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="items in satuan"
          :key="items.id"
          class="border-b border-black/10">
          <TableCell>{{ items.nama_satuan }}</TableCell>
          <TableCell>{{ items.kd_satuan }}</TableCell>
          <TableCell class="flex gap-2 justify-end">
            <!-- edit item -->
            <Dialog>
              <DialogTrigger as-child>
                <PencilSquareIcon
                  class="w-5 text-secondary cursor-pointer"
                  @click="getSatuanById(items.id)" />
              </DialogTrigger>
              <DialogContent class="sm:w-max-md">
                <DialogHeader>
                  <DialogTitle> Ubah Satuan </DialogTitle>
                </DialogHeader>
                <div class="flex items-center space-x-2">
                  <div class="grid flex-1 gap-2">
                    <Label>Nama Satuan</Label>
                    <Input v-model="nama" :disabled="!isLoaded" />
                    <Label>Simbol</Label>
                    <Input v-model="simbol" :disabled="!isLoaded" />
                  </div>
                </div>
                <DialogFooter class="sm:justify-around">
                  <DialogClose as-child>
                    <div class="flex justify-around gap-6">
                      <Button
                        class="bg-red text-white"
                        @click="(nama = null), (simbol = null)"
                        >Tutup</Button
                      >
                      <Button
                        class="bg-primary text-white"
                        @click="editSatuan(items.id)">
                        Simpan
                      </Button>
                    </div>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <!-- hapus item -->
            <Dialog>
              <DialogTrigger as-child>
                <TrashIcon class="w-5 text-red cursor-pointer" />
              </DialogTrigger>
              <DialogContent class="sm:w-max-md">
                <DialogHeader>
                  <VisuallyHidden>
                    <DialogTitle></DialogTitle>
                  </VisuallyHidden>
                </DialogHeader>
                <div class="mx-auto">
                  Apakah anda yakin ingin menghapus satuan ini?
                </div>
                <DialogFooter class="sm:justify-around">
                  <DialogClose as-child>
                    <div class="flex justify-around gap-6">
                      <Button class="bg-primary text-white">Tidak</Button>
                      <Button
                        class="bg-red text-white"
                        @click="deleteSatuan(items.id)">
                        Yakin
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
    Label,
    ClipLoader,
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon,
  },
  data() {
    return {
      satuan: [],
      nama: null,
      simbol: null,
      isLoaded: false,
      loading: true,
      loadingColor: "#0B324F",
      loadingSize: "60px",
    };
  },
  methods: {
    async getSatuan() {
      try {
        const satuan = await axios.get(useEnvStore().apiUrl + "/api/satuan");
        this.satuan = satuan.data.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async getSatuanById(id) {
      try {
        const satuan = await axios.get(
          useEnvStore().apiUrl + "/api/satuan/" + id
        );
        this.nama = satuan.data.data.nama_satuan;
        this.simbol = satuan.data.data.kd_satuan;
        this.isLoaded = true;
      } catch (err) {
        console.log(err);
      }
    },
    async addSatuan() {
      this.loading = true;
      try {
        const tambah = await axios.post(useEnvStore().apiUrl + "/api/satuan", {
          nama_satuan: this.nama,
          kd_satuan: this.simbol,
        });
        useUseToast().addToast();
        this.nama = null;
        this.simbol = null;
        this.getSatuan();
      } catch (err) {
        console.log(err);
      }
    },
    async editSatuan(id) {
      this.loading = true;
      try {
        const edit = await axios.put(
          useEnvStore().apiUrl + "/api/satuan/" + id,
          {
            nama_satuan: this.nama,
            kd_satuan: this.simbol,
          }
        );
        useUseToast().editToast();
        this.nama = null;
        this.simbol = null;
        this.getSatuan();
      } catch (err) {
        console.log(err);
      }
    },
    async deleteSatuan(id) {
      this.loading = true;
      try {
        const del = await axios.delete(
          useEnvStore().apiUrl + "/api/satuan/" + id
        );
        useUseToast().deleteToast();
        this.getSatuan();
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getSatuan();
  },
};
</script>

<style lang="scss" scoped></style>
