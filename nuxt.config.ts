// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  css: ["~/assets/css/tailwind.css"],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      api: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  ssr: false,
  devtools: { enabled: true },
});
