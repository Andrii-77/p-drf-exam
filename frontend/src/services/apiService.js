import axios from "axios";
import { baseURL } from "../constants/urls";
import { authService } from "./authService";

let auth; // 🔹 змінна для збереження посилання на AuthContext

// 🔹 Сетап-функція для передачі AuthContext у apiService
export const setAuthContext = (authContext) => {
  auth = authContext;
};

const apiService = axios.create({ baseURL });

// 🔹 Інтерцептор для access токена
apiService.interceptors.request.use((req) => {
  // Дістаємо токени з контексту або localStorage
  const tokens =
    auth?.tokens || JSON.parse(localStorage.getItem("tokens") || "null");
  const token = tokens?.access;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// 🔹 Інтерцептор відповіді для автоматичного refresh
apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens =
          auth?.tokens || JSON.parse(localStorage.getItem("tokens") || "null");
        const refresh = tokens?.refresh;

        const newTokens = await authService.refreshToken(refresh);

        // 🔄 оновлюємо токени в контексті
        auth?.updateTokens(newTokens);

        apiService.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newTokens.access}`;
        originalRequest.headers["Authorization"] = `Bearer ${newTokens.access}`;

        return apiService(originalRequest); // 🔄 повтор запиту з новим токеном
      } catch (refreshError) {
        console.error("❌ Refresh token помилка:", refreshError);
        auth?.logout();
        window.location.href = "/login"; // редірект на логін
      }
    }

    return Promise.reject(error);
  }
);

export { apiService };