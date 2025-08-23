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