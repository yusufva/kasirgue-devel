<template>
  <div class="flex h-full justify-center items-center">
    <Card class="w-3/4 lg:w-1/3 md:w-1/2 h-max border-primary">
      <CardHeader>
        <CardTitle class="flex flex-col items-center gap-2 text-primary">
          <img :src="logo" class="w-24" />
        </CardTitle>
        <CardDescription class="mx-auto text-xs text-primary"
          >Silahkan login untuk melanjutkan</CardDescription
        >
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <div class="flex gap-2">
          <UserCircleIcon class="w-8 text-primary"></UserCircleIcon>
          <Input
            placeholder="Masukan username"
            class="border-primary text-primary"
            v-model="user"></Input>
        </div>
        <div class="flex gap-2">
          <LockClosedIcon class="w-8 text-primary"></LockClosedIcon>
          <Input
            placeholder="Masukan password"
            type="password"
            class="border-primary text-primary"
            v-model="pass"
            @keyup.enter="toLogin()"></Input>
        </div>
      </CardContent>
      <CardFooter>
        <Button class="bg-primary text-white mx-auto" @click="toLogin()">
          <div v-if="loading">
            <PulseLoader
              :color="loadingColor"
              :size="loadingSize"></PulseLoader>
          </div>
          <div v-else>Login</div>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useUseToast } from "@/stores/useToast";
import { useEnvStore } from "@/stores/envStore";
import { useAuthStore } from "@/stores/authStore";
import { UserCircleIcon, LockClosedIcon } from "@heroicons/vue/24/solid";
import Logo from "@/assets/images/logo.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default {
  setup() {
    definePageMeta({
      layout: "auth",
    });
  },
  components: {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Input,
    Button,
    UserCircleIcon,
    LockClosedIcon,
    PulseLoader,
  },
  data() {
    return {
      loading: false,
      loadingColor: "#ffffff",
      loadingSize: "5px",
      logo: Logo,
      user: "",
      pass: "",
    };
  },
  methods: {
    async toLogin() {
      this.loading = true;
      try {
        const onLogin = await axios.post(
          useEnvStore().loginUrl + "/api/users/login",
          {
            email: this.user,
            password: this.pass,
          }
        );
        console.log(onLogin.data);
        this.decodejwt(onLogin.data.data.access_token);
        useAuthStore().getToken(onLogin.data.data.refresh_token);
        this.$router.push("/");
      } catch (err) {
        console.log(err)
        if (err.response.status === 404 || err.response.status === 400 || err.response.status === 401) {
          this.loading = false;
          useUseToast().failLogin();
        }
      }
    },
    aquireToken() {
      axios
        .get(useEnvStore().apiUrl + "token")
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    decodejwt(acctoken) {
      const token = acctoken;
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);
        useAuthStore().login(decoded);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
