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

export {api, serverApi};

