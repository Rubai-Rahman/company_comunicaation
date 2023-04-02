import axios from "axios";

const baseURL = process.env.hasuraEndPoint;

const hasurasecret: any = process.env.hasuraSecret;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": hasurasecret,
    
  },
});
export const postMutation = async (mutation: any, variables: any) => {
  const response = await axiosInstance.post("", { query: mutation, variables });
  return response.data.data;
};
export default axiosInstance;
