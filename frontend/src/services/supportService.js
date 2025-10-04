import { apiService } from "./apiService";
import { urls } from "../constants/urls";

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
};

export { supportService };