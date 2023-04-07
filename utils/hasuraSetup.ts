import axios from "axios";
import { getSession } from "next-auth/react";

const baseURL = process.env.hasuraEndPoint;
const hasurasecret = process.env.hasuraSecret;
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    //"x-hasura-admin-secret": hasurasecret,
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const session: any = await getSession();

  if (session?.jwtToken) {
    config.headers["Authorization"] = `Bearer ${session.jwtToken}`;
  }
  return config;
});

export const postMutation = async (mutation: any, variables: any) => {
  const response = await axiosInstance.post("", { query: mutation, variables });
  return response.data.data;
};

export default axiosInstance;
