// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt"
  ],

  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  css: ["~/assets/css/tailwind.css"],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.KASIRGUE_API_ENDPOINT,
      loginUrl: process.env.KASIRGUE_AUTH_ENDPOINT,
    },
  },
  devServer: {
    port: 2727
  },
  ssr: false,
  devtools: { enabled: true },
});
