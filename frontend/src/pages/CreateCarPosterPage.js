import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { carService } from "../services/carService"; // 🔹 створимо далі
import { useNavigate } from "react-router-dom";

const CreateCarPosterPage = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const getFieldError = (field) => errors?.[field]?.[0] || null;

  const inputClass = (field) =>
    `mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border focus:outline-none focus:ring-2 ${
      getFieldError(field)
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-700 focus:ring-blue-500"
    }`;

  const onSubmit = async (data) => {
    setLoading(true);
    setErrors({});
    try {
      await carService.createCar(data);
      alert("Оголошення створене ✅");
      navigate("/my-cars"); // 🔹 перенаправлення після створення
    } catch (err) {
      console.error("❌ CreateCarPoster error:", err);
      setErrors(err.response?.data || { detail: "Невідома помилка" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Створити оголошення
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">

          {/* Марка */}
          <label className="flex flex-col text-gray-100">
            Марка
            <input
              type="text"
              {...register("brand", { required: true })}
              className={inputClass("brand")}
            />
            {getFieldError("brand") && (
              <span className="text-red-500 text-sm">{getFieldError("brand")}</span>
            )}
          </label>

          {/* Модель */}
          <label className="flex flex-col text-gray-100">
            Модель
            <input
              type="text"
              {...register("model", { required: true })}
              className={inputClass("model")}
            />
            {getFieldError("model") && (
              <span className="text-red-500 text-sm">{getFieldError("model")}</span>
            )}
          </label>

          {/* Ціна */}
          <label className="flex flex-col text-gray-100">
            Ціна
            <input
              type="number"
              {...register("price", { required: true })}
              className={inputClass("price")}
            />
            {getFieldError("price") && (
              <span className="text-red-500 text-sm">{getFieldError("price")}</span>
            )}
          </label>

          {/* Валюта */}
          <label className="flex flex-col text-gray-100">
            Валюта
            <select {...register("currency")} className={inputClass("currency")}>
              <option value="UAH">₴ Гривня</option>
              <option value="USD">$ Долар</option>
              <option value="EUR">€ Євро</option>
            </select>
            {getFieldError("currency") && (
              <span className="text-red-500 text-sm">{getFieldError("currency")}</span>
            )}
          </label>

          {/* Локація */}
          <label className="flex flex-col text-gray-100">
            Локація
            <input
              type="text"
              {...register("location", { required: true })}
              className={inputClass("location")}
            />
            {getFieldError("location") && (
              <span className="text-red-500 text-sm">{getFieldError("location")}</span>
            )}
          </label>

          {/* Опис */}
          <label className="flex flex-col text-gray-100">
            Опис
            <textarea
              {...register("description")}
              className={inputClass("description")}
            />
            {getFieldError("description") && (
              <span className="text-red-500 text-sm">{getFieldError("description")}</span>
            )}
          </label>

          {/* Глобальна помилка */}
          {errors.detail && (
            <p className="text-red-500 text-sm text-center">{errors.detail}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors disabled:opacity-50"
          >
            {loading ? "Створення..." : "Створити"}
          </button>
        </form>
      </div>
    </div>
  );
};

export { CreateCarPosterPage };