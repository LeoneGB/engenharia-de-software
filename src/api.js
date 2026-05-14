import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://engenharia-de-software-9hj6.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

export const apiFileUrl = (fileUrl) => {
  if (!fileUrl) return "";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }
  return `${BASE_URL}${fileUrl}`;
};

export default api;
