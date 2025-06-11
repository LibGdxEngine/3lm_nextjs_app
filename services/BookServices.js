// services/bookService.js
import api from "../utils/api"; // The Axios instance

export const uploadPdf = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/books/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Important for file uploads
    },
    onUploadProgress: (progressEvent) => {
      // You can pass a callback here to update UI progress
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log("Upload progress:", percentCompleted);
      // Call a prop function or update state for progress bar
    },
  });
};

export const getBookProgress = (bookId) => {
  return api.get(`/books/${bookId}/progress`);
};

export const getBookResults = (bookId) => {
  return api.get(`/books/${bookId}/results`);
};
