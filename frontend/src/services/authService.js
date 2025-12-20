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