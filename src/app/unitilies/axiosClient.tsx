import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://127.0.0.1:3001"
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {

      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");

      window.location.href = "/login";
    }

    return Promise.reject(error); // Продовжити обробку помилки
  }
);

export default apiClient;
