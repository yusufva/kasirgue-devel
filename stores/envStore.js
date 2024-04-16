import { defineStore } from "pinia";

export const useEnvStore = defineStore("env",{
    state:()=>({
        // apiUrl: useRuntimeConfig().public.api
        apiUrl:"http://kasirgue.com:8081",
        loginUrl:"http://kasirgue.com:8080"
    })
})