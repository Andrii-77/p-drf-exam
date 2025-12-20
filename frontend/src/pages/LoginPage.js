import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login, updateTokens } = useAuth();
  const [loading, setLoading] = useState(false);

  // Якщо токени вже є — редірект на профіль
  useEffect(() => {
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
      navigate("/profile");
    }
  }, [navigate]);

  const onSubmit = async (credentials) => {
    setLoading(true);

    try {
      // 🔹 1. Логін → отримуємо токени
      const tokens = await authService.login(credentials);

      // 🔹 2. Зберігаємо токени у контексті
      updateTokens(tokens);

      // 🔹 3. Отримуємо користувача (apiService сам підставить access)
      const user = await authService.getMe();

      // 🔹 4. Оновлюємо контекст (юзер + токени)
      login(user, tokens);

      // 🔹 5. Редірект
      navigate("/profile");
    } catch (err) {
      console.error("❌ Помилка логіну:", err);

      const data = err.response?.data;
      let msg = "Помилка при логіні. Перевірте дані.";

      if (data) {
        if (data.detail) {
          msg = data.detail;
        } else if (data.non_field_errors) {
          msg = data.non_field_errors.join("\n");
        } else {
          msg = Object.values(data).flat().join("\n");
        }
      }

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Увійти
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Пароль"
            {...register("password", { required: true })}
            className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Вхід..." : "Увійти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export { LoginPage };