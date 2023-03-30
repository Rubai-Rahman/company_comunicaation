import axios from "axios";
const setAxios = async (token: string | null) => {
  axios.defaults.baseURL = process.env.hasuraApi;
  axios.defaults.method = "POST";
  axios.defaults.headers.common["Content-type"] = "application/json";
  // axios.defaults.headers.common['x-hasura-admin-secret'] = process.env.hasuraAdminSecret
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    axios.defaults.headers.common["Authorization"] = null;
    // axios.defaults.headers.common['x-hasura-unauthorized-role'] = 'public'
    // axios.defaults.headers.common['x-hasura-admin-secret'] = process.env.hasuraAdminSecret
  }
};
export default setAxios;
