import { defineStore } from "pinia";

export const useEnvStore = defineStore("env",{
    state:()=>({
        apiUrl: useRuntimeConfig().public.api
    })
})