import axios, {AxiosRequestConfig} from 'axios';
import {authKey} from "../config";


const api = axios.create({
  baseURL: "/api/",
});
api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const token = localStorage.getItem(authKey);
  if (token) {
    // @ts-ignore
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const serverApi = axios.create({
  baseURL: `${process.env.VERCEL_URL}/api`,
});

const getApiErrorMessage = (error: any): string => {
  let errMessage: string;
  if (axios.isAxiosError(error)) {
    // @ts-ignore
    errMessage = error.response.data.message ?? error.response.data.error;
    // @ts-ignore
    if (error.response.data.details) {
      // @ts-ignore
      errMessage += "\n\n" + error.response.data.details.map((detail: any) => detail.message).join(",\n");
    }
  } else {
    errMessage = "Something went wrong. Please try again in a few moments";
  }

  return errMessage;
};

export {api, serverApi, getApiErrorMessage};

