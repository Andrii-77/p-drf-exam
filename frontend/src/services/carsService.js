import { apiService } from "./apiService";
import { urls } from "../constants/urls";

const carService = {
  getAllCars(params = {}) {
    return apiService.get(urls.cars, { params });  // тепер підтримує фільтри та пагінацію
  },
  create(data) {
    return apiService.post(urls.cars, data);
  },
};

export { carService };




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