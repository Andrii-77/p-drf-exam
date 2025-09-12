import { apiService } from "./apiService";
import { urls } from "../constants/urls";

const authService = {
  async login(credentials) {
    const response = await apiService.post(urls.auth.login, credentials);

    const { access, refresh } = response.data;
    if (!access || !refresh) {
      throw new Error("Токени не отримано");
    }

    return response.data; // { access, refresh, ... }
  },

  async refreshToken(refresh) {
    if (!refresh) {
      throw new Error("Refresh токен відсутній");
    }

    const response = await apiService.post(urls.auth.refresh, { refresh });
    const { access, refresh: newRefresh } = response.data;

    if (!access) {
      throw new Error("Не вдалося оновити токен");
    }

    return { access, refresh: newRefresh || refresh };
  },

  async getMe() {
    const response = await apiService.get(urls.auth.me);
    return response.data;
  },

  logout() {
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
  },
};

export { authService };




// import { apiService } from "./apiService";
// import { urls } from "../constants/urls";
//
// const authService = {
//   async login(user) {
//     const response = await apiService.post(urls.auth.login, user);
//
//     const { access, refresh } = response.data;
//     if (!access || !refresh) throw new Error("Токени не отримано");
//
//     localStorage.setItem("access", access);
//     localStorage.setItem("refresh", refresh);
//
//     return response.data; // { access, refresh }
//   },
//
//   async refreshToken() {
//     const refresh = localStorage.getItem("refresh");
//     if (!refresh) throw new Error("Refresh токен відсутній");
//
//     const response = await apiService.post(urls.auth.refresh, { refresh });
//
//     // Якщо бекенд повертає і refresh — оновимо обидва
//     const { access, refresh: newRefresh } = response.data;
//
//     if (access) {
//       localStorage.setItem("access", access);
//       if (newRefresh) {
//         localStorage.setItem("refresh", newRefresh);
//       }
//       return { access, refresh: newRefresh || refresh };
//     }
//
//     throw new Error("Не вдалося оновити токен");
//   },
//
//   async getMe() {
//     const response = await apiService.get(urls.auth.me);
//     return response.data;
//   },
//
//   logout() {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     localStorage.removeItem("user"); // 🔹 Якщо ви зберігали юзера
//   },
//
//   isAuthenticated() {
//     return !!localStorage.getItem("access") && !!localStorage.getItem("refresh");
//   }
// };
//
// export { authService };




// import { apiService } from "./apiService";
// import { urls } from "../constants/urls";
//
// const authService = {
//   async login(user) {
//     const response = await apiService.post(urls.auth.login, user);
//     const access = response.data?.access;
//     if (!access) throw new Error("Токен не отримано");
//
//     localStorage.setItem('access', access);
//     return response.data; // { access, refresh }
//   },
//
//   async getMe() {
//     const response = await apiService.get(urls.auth.me);
//     return response.data; // дані користувача
//   },
// };
//
// export { authService };

// import { apiService } from "./apiService";
// import { urls } from "../constants/urls";
//
// const authService = {
//   async login(user) {
//     console.log("💡 login() викликано з:", user);
//
//     try {
//       // Виклик API для логіну
//       const response = await apiService.post(urls.auth.login, user);
//       console.log("💡 response від сервера:", response);
//
//       // Безпечне отримання токена
//       const access = response.data?.access;
//       if (!access) {
//         console.error("❌ Токен не отримано!");
//         return undefined;
//       }
//
//       // Збереження токена в localStorage
//       localStorage.setItem('access', access);
//       console.log("💡 Токен збережено в localStorage:", access);
//
//       // Повертаємо об'єкт відповіді (можна використати в компоненті)
//       return response.data;
//     } catch (err) {
//       console.error("❌ login() помилка:", err);
//       throw err; // передаємо помилку далі
//     }
//   },
//
//   // Можна додати метод getMe для отримання даних користувача
//   async getMe() {
//     try {
//       const response = await apiService.get(urls.auth.me);
//       console.log("💡 Дані користувача:", response.data);
//       return response.data;
//     } catch (err) {
//       console.error("❌ getMe() помилка:", err);
//       throw err;
//     }
//   },
// };
//
// export { authService };

// import { apiService } from "./apiService";
// import { urls } from "../constants/urls";
//
// const authService = {
//   async login(user) {
//     console.log("💡 login() викликано з:", user);
//
//     try {
//       const response = await apiService.post(urls.auth.login, user);
//       console.log("💡 Відповідь від apiService:", response);
//
//       if (!response || !response.data) {
//         console.error("❌ response або response.data відсутній!");
//         return undefined;
//       }
//
//       const { access } = response.data;
//       console.log("💡 access токен:", access);
//
//       localStorage.setItem('access', access);
//       console.log("💡 токен збережено в localStorage");
//
//       return response.data; // обов'язково повертаємо об'єкт
//     } catch (err) {
//       console.error("❌ login() помилка:", err);
//       throw err; // передаємо далі, щоб LoginPage зловив
//     }
//   },
// };
//
// export { authService };

// import { apiService } from "./apiService";
// import { urls } from "../constants/urls";
//
// const authService = {
//   async login(user) {
//     const { data } = await apiService.post(urls.auth.login, user);
//
//     // Зберігаємо токен в localStorage
//     localStorage.setItem('access', data.access);
//
//     // Повертаємо токен (щоб його можна було використати в компоненті)
//     return data;
//   },
// };
//
// export { authService };

// import {apiService} from "./apiService";
// import {urls} from "../constants/urls";
//
// const authService = {
//     async login(user) {
//         const {data: {access}} = await apiService.post(urls.auth.login, user);
//         localStorage.setItem('access', access)
//     },
// }
//
// export {
//     authService
// }