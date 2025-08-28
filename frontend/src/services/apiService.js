import axios from "axios";
import { baseURL } from "../constants/urls";

const apiService = axios.create({ baseURL });

apiService.interceptors.request.use(req => {
    const token = localStorage.getItem('access');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export { apiService };



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