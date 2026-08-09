const envUrl = import.meta.env.VITE_API_URL;

export const API_URL =
  envUrl && envUrl !== "undefined" && envUrl.trim() !== ""
    ? envUrl
    : "https://clubviews-backend.onrender.com";

export default API_URL;
