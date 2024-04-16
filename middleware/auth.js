import { useAuthStore } from "@/stores/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isLoggedIn;

  if (!isAuth){
    return navigateTo('/login')
  }
});
