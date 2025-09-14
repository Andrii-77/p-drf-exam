import {apiService} from "./apiService";
import {urls} from "../constants/urls";

const carService = {
    // список авто (з параметрами: пагінація, фільтри)
    getAllCars(params = {}) {
        return apiService.get(urls.cars, {params});
    },

    // getCarById(id) {
    //     const url = `${urls.cars}/${id}`;           // формуємо URL
    //     console.log("[carService] Fetching car by ID:", url); // ⬅️ Якір 1
    //     return apiService.get(url)
    //         .then(res => {
    //             console.log("[carService] Response data:", res.data); // ⬅️ Якір 2
    //             return res;
    //         })
    //         .catch(err => {
    //             console.error("[carService] Error fetching car:", err); // ⬅️ Якір 3
    //             throw err; // щоб помилка не зникла
    //         });
    // },

    // отримати одне авто по id
     getCarById(id) {
       return apiService.get(`${urls.cars}/${id}`);
     },

    // створення нового авто
    createCar(data) {
        return apiService.post(urls.cars, data);
    },

    // оновлення авто
    updateCar(id, data) {
        return apiService.put(`${urls.cars}${id}/`, data);
    },

    // видалення авто
    deleteCar(id) {
        return apiService.delete(`${urls.cars}${id}/`);
    },
};

export {carService};


// import { apiService } from "./apiService";
// import { urls } from "../constants/urls";
//
// const carService = {
//   getAllCars(params = {}) {
//     return apiService.get(urls.cars, { params });  // тепер підтримує фільтри та пагінацію
//   },
//   create(data) {
//     return apiService.post(urls.cars, data);
//   },
// };
//
// export { carService };


// import {apiService} from "./apiService";
// import {urls} from "../constants/urls";
//
// const carService = {
//     getAll(){
//         return apiService.get(urls.cars)
//     },
//     create(data){
//         return apiService.post(urls.cars, data)
//     }
// }
//
// export {
//     carService
// }