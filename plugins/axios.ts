import axios from "axios";

import { useEnvStore } from "@/stores/envStore";

export default defineNuxtPlugin(() => {
  axios.interceptors.request.use(
    (config) => {
      // Do something before request is sent
      // axios
      //   .get(useEnvStore().apiUrl + "/auth/refresh")
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
});
