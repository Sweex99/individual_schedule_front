import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api-indi-schedule.pp.ua/"
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
