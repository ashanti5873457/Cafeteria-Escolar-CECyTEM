import axios from "axios";

const API = axios.create({
  baseURL: "https://cafeteria-escolar-cecytem-1.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;