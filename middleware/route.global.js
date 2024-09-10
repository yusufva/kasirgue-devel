import { useAuthStore } from "@/stores/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isLoggedIn;
  const role = authStore.role;

  // login navguard
  if (to.path !== "/login" && !isAuth) {
    return navigateTo("/login");
  }
  if (to.path == "/login" && isAuth) {
    return navigateTo("/");
  }

  // role navguard
  if (to.path !== "/penjualan/tambah" && role === 1) {
    return navigateTo("/penjualan/tambah");
  } else {
    return;
  }
});
