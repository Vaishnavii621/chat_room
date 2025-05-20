import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? `${window.location.origin}/api/v1`
    : "http://localhost:5000/api/v1",
  withCredentials: true, // if using cookies for auth
});

export default api;
