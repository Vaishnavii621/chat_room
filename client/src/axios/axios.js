import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD ? window.location.origin : "http://localhost:5000",
  withCredentials: true, // if using cookies for auth
});

export default api;
