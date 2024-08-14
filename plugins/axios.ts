import axios from "axios";

export default defineNuxtPlugin(() => {
  // axios.interceptors.request.use(
  //   (config) => {
  //     // Do something before request is sent
  //     config.headers["Access-Control-Allow-Origin"] = "*";
  //     return config;
  //   },
  //   function (error) {
  //     // Do something with request error
  //     return Promise.reject(error);
  //   }
  // );
});
