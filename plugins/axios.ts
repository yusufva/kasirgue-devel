import axios from "axios";

import { useEnvStore } from "@/stores/envStore";
import { useAuthStore } from "@/stores/authStore";

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

export default defineNuxtPlugin(() => {
  axios.interceptors.request.use(
    (request) => {
      // Do something before request is sent
      if (request.url !== "https://api.kasirgue.com/auth/api/users/login") {
        request.headers['Authorization'] = "Bearer " + useAuthStore().accessToken
        return request
      }
      return request
    },
    function (error) {
      // Do something with request error
      console.log(error)
      return Promise.reject(error);
    }
  );
});

const processQueue = (error: null, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios
          .get(useEnvStore().loginUrl + '/api/users/refresh',
            {
              headers: {
                'x-refresh-token': useAuthStore().refreshToken
              }
            })
          .then(({ data }) => {
            // console.log(data)
            authStore.getToken(data.data.access_token, useAuthStore().refreshToken);
            axios.defaults.headers.common['Authorization'] =
              'Bearer ' + data.data.access_token;
            originalRequest.headers['Authorization'] =
              'Bearer ' + data.data.access_token;
            processQueue(null, data.data.access_token);
            resolve(axios(originalRequest));
          })
          .catch(err => {
            processQueue(err, null);
            // authStore.clearToken();
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);
