// utils/api.js
import axios from "axios";

// Create a custom Axios instance
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1/ocr", // Use environment variable for base URL
  timeout: 60000, // Request timeout in milliseconds (e.g., 60 seconds)
  headers: {
    // You might set common headers here, but 'Content-Type' for FormData is often handled automatically
  },
});

// Optional: Add request interceptors (e.g., for adding authorization tokens)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('yourAuthToken'); // Example: get token from local storage
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptors (e.g., for global error handling, logging)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Response Error:", error.response.data);
      // You could show a toast notification here
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API Request Error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Axios Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
