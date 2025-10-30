import { apiService } from "./apiService";
import { urls } from "../constants/urls";

const userService = {
  // 🔹 Отримати всіх користувачів (з пагінацією, фільтрацією та сортуванням)
  getAll(params = {}) {
    /*
      Підтримувані параметри:
      - page, page_size
      - role (buyer, seller, manager, admin)
      - account_type (basic, premium)
      - is_active (true / false)
      - ordering (id, email, role, is_active, account_type)
    */
    return apiService.get(urls.users, { params });
  },

  // 🔹 Створити нового користувача
  create(data) {
    return apiService.post(urls.users, data);
  },

  // 🔹 Отримати користувача за ID
  getById(id) {
    return apiService.get(`${urls.users}/${id}`);
  },

  // 🔹 Оновити дані користувача (повністю або частково)
  update(id, data) {
    return apiService.patch(`${urls.users}/${id}`, data);
  },

  // 🔹 Видалити користувача (опціонально)
  delete(id) {
    return apiService.delete(`${urls.users}/${id}`);
  },
};

export { userService };



// // 20251028 Змінюю щоб додати сортування і фільтр.
// import { apiService } from "./apiService";
// import { urls } from "../constants/urls";
//
// const userService = {
//   // 🔹 Отримати всіх користувачів (з пагінацією, фільтром за роллю тощо)
//   getAll(params = {}) {
//     return apiService.get(urls.users, { params });
//   },
//
//   // 🔹 Створити нового користувача (наприклад, під час реєстрації)
//   create(data) {
//     return apiService.post(urls.users, data);
//   },
//
//   // 🔹 Отримати користувача за ID
//   getById(id) {
//     return apiService.get(`${urls.users}/${id}`);
//   },
//
//   // 🔹 Оновити дані користувача (повністю або частково)
//   update(id, data) {
//     // Використовуємо PATCH, щоб можна було частково оновлювати дані
//     return apiService.patch(`${urls.users}/${id}/`, data);
//   },
//
//   // 🔹 Видалити користувача (опціонально — може використовуватись лише адміном)
//   delete(id) {
//     return apiService.delete(`${urls.users}/${id}/`);
//   },
// };
//
// export { userService };