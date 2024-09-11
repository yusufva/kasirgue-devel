import { defineStore } from "pinia";

export const useEnvStore = defineStore("env", {
  state: () => ({
    apiUrl: useRuntimeConfig().public.apiUrl,
    loginUrl: useRuntimeConfig().public.loginUrl,
    // apiUrl:"https://dev-api.kasirgue.com",
    // loginUrl:"https://api.kasirgue.com/auth"
  }),
});
