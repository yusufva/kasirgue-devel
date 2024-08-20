import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null,
    name: null,
    role: null,
    isLoggedIn: false,
    alamat: null,
    org_name: null,
    phone: null,
  }),
  actions: {
    getToken(token) {
      this.accessToken = token;
    },
    login(response) {
      this.isLoggedIn = true;
      this.role = response.role;
      this.name = response.name;
      this.alamat = response.alamat;
      this.phone = response.phone;
      this.org_name = response.org_name;
    },
    logout() {
      this.isLoggedIn = false;
      this.role = null;
      this.name = null;
      this.alamat = null;
      this.phone = null;
      this.org_name = null;
      this.accessToken = null;
    },
  },
  getters: {
    loginStatus() {
      return this.isLoggedIn;
    },
    getUsername() {
      return this.name;
    },
    getRole() {
      return this.role;
    },
  },
  persist: {
    storage: persistedState.sessionStorage,
  },
});
