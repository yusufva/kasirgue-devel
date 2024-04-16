<template>
  <div class="flex h-full justify-center items-center">
    <Card class="w-3/4 lg:w-1/3 md:w-1/2 h-max border-primary">
      <CardHeader>
        <CardTitle class="flex flex-col items-center gap-2 text-primary">
          <img :src="logo" class="w-24" />
          <div>PT. ACME Indonesia</div>
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
            v-model="user"
          ></Input>
        </div>
        <div class="flex gap-2">
          <LockClosedIcon class="w-8 text-primary"></LockClosedIcon>
          <Input
            placeholder="Masukan password"
            type="password"
            class="border-primary text-primary"
            v-model="pass"
            @keyup.enter="toLogin()"
          ></Input>
        </div>
      </CardContent>
      <CardFooter>
        <Button class="bg-primary text-white mx-auto" @click="toLogin()"
          >Login</Button
        >
      </CardFooter>
    </Card>
  </div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";
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
    useSeoMeta({
      title: "Login | Kasirgue",
    }),
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
  },
  data() {
    return {
      logo: Logo,
      user: null,
      pass: null,
    };
  },
  methods: {
    async toLogin() {
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
        useAuthStore().getToken(onLogin.data.data.access_token);
        this.$router.push("/");
      } catch (err) {
        console.log(err);
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
