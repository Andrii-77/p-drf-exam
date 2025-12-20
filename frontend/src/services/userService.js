import {apiService} from "./apiService";
import {urls} from "../constants/urls";

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
        return apiService.get(urls.users, {params});
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
    // 🔹 Зміна пароля
    changePassword(data) {
        // data = { current_password, new_password }
        return apiService.post("/auth/change-password", data);
    },
};

export {userService};