// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
  css: ["~/assets/css/tailwind.css"],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  devtools: { enabled: true },
});
