import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  function (err) {
    console.log(err, "From Axios Interceptor");

    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.errors?.message || "Something went wrong"
      );
    }
  }
);
