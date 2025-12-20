import {apiService} from "./apiService";
import {urls} from "../constants/urls";

const carService = {
    // список авто
    getAllCars(params = {}) {
        return apiService.get(urls.cars, {params});
    },

    // одне авто
    getCarById(id) {
        return apiService.get(`${urls.cars}/${id}`);
    },

    // 🧍‍♂️ Усі авто конкретного користувача
    getUserCars(userId, params = {}) {
        return apiService.get(urls.userCars(userId), {params});
    },

    // ➕ Створення нового авто користувачем
    createCar(userId, data) {
        return apiService.post(urls.userCars(userId), data);
    },


    // оновлення авто
    updateCar(id, data) {
        return apiService.patch(`${urls.cars}/${id}`, data);
    },

    // видалення авто
    deleteCar(id) {
        return apiService.delete(`${urls.cars}/${id}`);
    },

    // список брендів
    getBrands() {
        return apiService.get(urls.brands);
    },

    // створення нового бренду
    createBrand(data) {
        return apiService.post(urls.brands, data);
    },

    // оновлення бренду
    updateBrand(id, data) {
        return apiService.patch(`${urls.brands}/${id}`, data);
    },

    // список моделей
    getModels(params = {}) {
        return apiService.get(urls.models, {params});
    },

    // отримати одну модель
    getModelById(id) {
        return apiService.get(`${urls.models}/${id}`);
    },

    // створення нової моделі
    createModel(data) {
        return apiService.post(urls.models, data);
    },

    // оновлення моделі
    updateModel(id, data) {
        return apiService.patch(`${urls.models}/${id}`, data);
    },
};

export {carService};