import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const onSubmit = async (credentials) => {
    setError("");
    try {
      // 🔑 Отримуємо токени
      const tokenData = await authService.login(credentials);

      // 👤 Отримуємо дані користувача
      const user = await authService.getMe(tokenData.access); // тут треба доробити сервіс!!!

      // ✅ Зберігаємо в AuthContext
      login(user, tokenData);

      // 🚀 Перехід після успішного логіну
      navigate("/recipes");
    } catch (err) {
      setError("Невірний логін або пароль");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Увійти</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        <input
          type="password"
          placeholder="Пароль"
          {...register("password", { required: true })}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export {LoginPage};