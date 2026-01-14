import axios from "axios";

// Use Vite runtime env var `VITE_API_URL` (set this in your frontend .env or in Render)
// Fallback to localhost during local development
const API_URL = import.meta.env.VITE_API_URL_2;
console.log(API_URL);

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export default instance;
