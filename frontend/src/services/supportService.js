import {apiService} from "./apiService";
import {urls} from "../constants/urls";

const supportService = {
    // повідомлення про відсутній бренд
    reportMissingBrand(data) {
        // data = { text: "Renault" }
        return apiService.post(urls.support, {
            type: "brand",
            text: data.text,
        });
    },

    // повідомлення про відсутню модель
    reportMissingModel(data) {
        // data = { brand: 1, text: "Megane" }
        return apiService.post(urls.support, {
            type: "model",
            brand: data.brand,
            text: data.text,
        });
    },


    // 🔹 Отримати всі запити з параметрами (наприклад, page)
    getAll(params = {}) {
        // params = { page: 1, page_size: 10, ... }
        return apiService.get(urls.support, {params});
    },

    // 🔹 Позначити як виконаний
    markProcessed(id) {
        return apiService.patch(`${urls.support}/${id}`, {processed: true});
    },

    // 🔹 Отримати список брендів для фільтра
    getBrands() {
        return apiService.get(`${urls.support}/brands`);
    },

};

export {supportService};