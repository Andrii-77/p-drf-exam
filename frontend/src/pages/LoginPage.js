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
      const tokenData = await authService.login(credentials);
      const user = await authService.getMe();
      login(user, tokenData);
      navigate("/profile");
    } catch (err) {
      setError("Невірний логін або пароль");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Увійти
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4"
        >
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

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors"
          >
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
};

export { LoginPage };