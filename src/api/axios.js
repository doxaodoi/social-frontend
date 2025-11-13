import axios from "axios";

// replace with your backend URL
const API_BASE = "https://universe-mq1h.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
});

export default api;
