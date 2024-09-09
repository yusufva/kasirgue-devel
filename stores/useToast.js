import { defineStore } from "pinia";

export const useUseToast = defineStore("toast", {
  actions: {
    deleteToast() {
      const { $swal } = useNuxtApp();
      $swal.fire({
        position: "top-end",
        toast: true,
        timerProgressBar: true,
        icon: "success",
        text: "Data berhasil dihapus.",
        background: "#E84545",
        color: "#ffffff",
        iconColor: "#ffffff",
        showConfirmButton: false,
        timer: 3000,
      });
    },
    failLogin() {
      const { $swal } = useNuxtApp();
      $swal.fire({
        position: "top-end",
        toast: true,
        timerProgressBar: true,
        icon: "error",
        text: "Login gagal. Periksa kembali user dan password anda.",
        background: "#E84545",
        color: "#ffffff",
        iconColor: "#ffffff",
        showConfirmButton: false,
        timer: 3000,
      });
    },
    noDomain() {
      const { $swal } = useNuxtApp();
      $swal.fire({
        position: "top-end",
        toast: true,
        timerProgressBar: true,
        icon: "error",
        text: "Login gagal. Akun ini tidak tersedia pada domain ini.",
        background: "#E84545",
        color: "#ffffff",
        iconColor: "#ffffff",
        showConfirmButton: false,
        timer: 3000,
      });
    },
    emptyStock(error) {
      const { $swal } = useNuxtApp();
      $swal.fire({
        position: "top-end",
        toast: true,
        timerProgressBar: true,
        icon: "error",
        text: error,
        background: "#E84545",
        color: "#ffffff",
        iconColor: "#ffffff",
        showConfirmButton: false,
        timer: 3000,
      });
    },
    sameProductName() {
      const { $swal } = useNuxtApp();
      $swal.fire({
        position: "top-end",
        toast: true,
        timerProgressBar: true,
        icon: "error",
        text: "Produk dengan nama yang sama sudah terdaftar.",
        background: "#E84545",
        color: "#ffffff",
        iconColor: "#ffffff",
        showConfirmButton: false,
        timer: 3000,
      });
    },
    formNotCompleted() {
      const { $swal } = useNuxtApp();
      $swal.fire({
        position: "top-end",
        toast: true,
        timerProgressBar: true,
        icon: "error",
        text: "Harap lengkapi form.",
        background: "#E84545",
        color: "#ffffff",
        iconColor: "#ffffff",
        showConfirmButton: false,
        timer: 3000,
      });
    },
    addToast() {
      const { $swal } = useNuxtApp();
      $swal.fire({
        position: "top-end",
        toast: true,
        timerProgressBar: true,
        icon: "success",
        text: "Data berhasil ditambahkan.",
        background: "#0B324F",
        color: "#ffffff",
        iconColor: "#ffffff",
        showConfirmButton: false,
        timer: 3000,
      });
    },
    editToast() {
      const { $swal } = useNuxtApp();
      $swal.fire({
        position: "top-end",
        toast: true,
        timerProgressBar: true,
        icon: "success",
        text: "Data berhasil diubah.",
        background: "#F18200",
        color: "#ffffff",
        iconColor: "#ffffff",
        showConfirmButton: false,
        timer: 3000,
      });
    },
    invalidDate() {
      const { $swal } = useNuxtApp();
      $swal.fire({
        position: "top-end",
        toast: true,
        timerProgressBar: true,
        icon: "warning",
        title: "Tanggal Invalid.",
        text: "Pastikan tanggal mulai dan tanggal akhir terisi",
        background: "#E84545",
        color: "#ffffff",
        iconColor: "#ffffff",
        showConfirmButton: false,
        timer: 3000,
      });
    },
    logout() {
      const { $swal } = useNuxtApp();
      $swal.fire({
        position: "top-end",
        toast: true,
        timerProgressBar: true,
        icon: "success",
        title: "Logout Berhasil",
        text: "Silahkan login kembali untuk mengakses layanan.",
        background: "#E84545",
        color: "#ffffff",
        iconColor: "#ffffff",
        showConfirmButton: false,
        timer: 3000,
      });
    },
  },
});
