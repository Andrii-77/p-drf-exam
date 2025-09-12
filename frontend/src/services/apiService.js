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




// import axios from "axios";
// import { baseURL } from "../constants/urls";
// import { authService } from "./authService";
//
// const apiService = axios.create({ baseURL });
//
// // 🔹 Інтерцептор для access токена
// apiService.interceptors.request.use((req) => {
//   const token = localStorage.getItem("access");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });
//
// // 🔹 Інтерцептор відповіді для автоматичного refresh
// apiService.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//
//       try {
//         const { access } = await authService.refreshToken();
//
//         apiService.defaults.headers.common["Authorization"] = `Bearer ${access}`;
//         originalRequest.headers["Authorization"] = `Bearer ${access}`;
//
//         return apiService(originalRequest); // 🔄 повтор запиту з новим токеном
//       } catch (refreshError) {
//         console.error("❌ Refresh token помилка:", refreshError);
//         authService.logout();
//         window.location.href = "/login"; // редірект на логін
//       }
//     }
//
//     return Promise.reject(error);
//   }
// );
//
// export { apiService };




// import axios from "axios";
// import { baseURL } from "../constants/urls";
//
// const apiService = axios.create({ baseURL });
//
// apiService.interceptors.request.use(req => {
//     const token = localStorage.getItem('access');
//     if (token) {
//         req.headers.Authorization = `Bearer ${token}`;
//     }
//     return req;
// });
//
// export { apiService };



// import axios from "axios";
// import { baseURL } from "../constants/urls";
//
// // Створюємо інстанс axios з базовим URL
// const api = axios.create({
//   baseURL,
//   headers: { "Content-Type": "application/json" },
// });
//
// // Інтерсептор додає Authorization, якщо є токен
// api.interceptors.request.use((config) => {
//   const tokens = localStorage.getItem("tokens"); // беремо весь об’єкт токенів
//   if (tokens) {
//     const parsedTokens = JSON.parse(tokens);
//     if (parsedTokens?.access) {
//       config.headers.Authorization = `Bearer ${parsedTokens.access}`;
//     }
//   }
//   return config;
// });
//
// // Обгортка для запитів
// const apiService = {
//   get(url, options = {}) { return api.get(url, options); },
//   post(url, data, options = {}) { return api.post(url, data, options); },
//   put(url, data, options = {}) { return api.put(url, data, options); },
//   delete(url, options = {}) { return api.delete(url, options); },
// };
//
// export { apiService };



// import axios from "axios";
// import { baseURL } from "../constants/urls";
//
// const api = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
//
// api.interceptors.request.use((config) => {
//   const tokens = localStorage.getItem("tokens");
//   if (tokens) {
//     const parsedTokens = JSON.parse(tokens);
//     if (parsedTokens?.access) {
//       config.headers.Authorization = `Bearer ${parsedTokens.access}`;
//     }
//   }
//   return config;
// });
//
// const apiService = {
//   get(url, options = {}) {
//     return api.get(url, options);
//   },
//   post(url, data, options = {}) {
//     return api.post(url, data, options);
//   },
//   put(url, data, options = {}) {
//     return api.put(url, data, options);
//   },
//   delete(url, options = {}) {
//     return api.delete(url, options);
//   },
// };
//
// export { apiService };



// import axios from "axios";
// import { baseURL } from "../constants/urls";
//
// const apiService = axios.create({ baseURL });
//
// apiService.interceptors.request.use(req => {
//     const token = localStorage.getItem('access');
//     if (token) {
//         req.headers.Authorization = `Bearer ${token}`;
//     }
//     return req;
// });
//
// export { apiService };

// import axios from "axios";
// import { baseURL } from "../constants/urls";
//
// const apiService = axios.create({ baseURL });
//
// // 🔹 Інтерцептор для додавання токена
// apiService.interceptors.request.use(req => {
//     const token = localStorage.getItem('access');
//     if (token) {
//         req.headers.Authorization = `Bearer ${token}`;
//     }
//
//     console.log("💡 apiService.request:", req.method, req.url, req.data); // Якір перед запитом
//     return req;
// });
//
// // 🔹 Інтерцептор відповіді (опційно, щоб бачити всі відповіді)
// apiService.interceptors.response.use(
//     response => {
//         console.log("💡 apiService.response:", response);
//         return response;
//     },
//     error => {
//         console.error("❌ apiService.response помилка:", error);
//         return Promise.reject(error);
//     }
// );
//
// export { apiService };

// import axios from "axios";
// import {baseURL} from "../constants/urls";
//
// const apiService = axios.create({baseURL})
//
// apiService.interceptors.request.use(req=>{
//     const token = localStorage.getItem('access');
//
//     if (token){
//         req.headers.Authorization = `Bearer ${token}`
//     }
//     return req
// })
//
// export {
//     apiService
// }