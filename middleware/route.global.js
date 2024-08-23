import { useAuthStore } from "@/stores/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isLoggedIn;

  if (to.path !== "/login" && !isAuth) {
    return navigateTo("/login");
  }
  if (to.path == "/login" && isAuth) {
    return navigateTo("/");
  } else {
    return;
  }
});
