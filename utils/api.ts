import axios from 'axios';

export const api = axios.create({
  baseURL: "/api/",
});

export const serverApi = axios.create({
  baseURL: `${process.env.VERCEL_URL}/api`,
});
