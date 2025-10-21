import { apiService } from "./apiService";
import { urls } from "../constants/urls";

const userService = {
  // 🔹 Отримати всіх користувачів з пагінацією та фільтром
  getAll(params = {}) {
    // Тепер передаємо query-параметри (page, page_size, role)
    return apiService.get(urls.users, { params });
  },

  // 🔹 Створити користувача
  create(data) {
    return apiService.post(urls.users, data);
  },

  // 🔹 Отримати користувача за ID
  getById(id) {
    return apiService.get(`${urls.users}/${id}`);
  },
};

export { userService };