import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { carService } from "../services/carService";
import { useForm } from "react-hook-form";

const EditBrandPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      brand: ""
    }
  });

  const [backendError, setBackendError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await carService.getBrands();
        const brand = (res.data || []).find((b) => b.id === parseInt(id));

        if (!brand) {
          setBackendError({ detail: "Бренд не знайдено." });
          return;
        }

        setValue("brand", brand.brand);
      } catch {
        setBackendError({ detail: "Помилка при завантаженні бренду." });
      }
    };

    fetchBrand();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await carService.updateBrand(id, { brand: data.brand.trim() });
      setSuccessMessage("✅ Бренд успішно оновлено!");
      setBackendError(null);
    } catch (err) {
      setSuccessMessage(null);
      setBackendError(err.response?.data || { detail: "Помилка при оновленні бренду." });
    }
  };

  return (
    <div className="p-4 min-h-[80vh] flex justify-center items-start">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md">

        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          ← Повернутись
        </button>

        <h1 className="text-2xl font-bold text-gray-100 mb-4">Редагувати бренд</h1>

        {/* ❌ Повідомлення про помилку */}
        {backendError && (
          <div className="relative mb-4 p-3 rounded bg-red-800 text-red-200 text-sm">
            ⚠ {backendError.detail}
            <button
              onClick={() => setBackendError(null)}
              className="absolute top-1 right-2 text-red-300 hover:text-white"
            >
              ✖
            </button>
          </div>
        )}

        {/* ✅ Повідомлення успіху */}
        {successMessage && (
          <div className="relative mb-4 p-3 rounded bg-green-800 text-green-200 text-sm">
            {successMessage}
            <button
              onClick={() => setSuccessMessage(null)}
              className="absolute top-1 right-2 text-green-300 hover:text-white"
            >
              ✖
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="flex flex-col text-gray-100">
            Назва бренду
            <input
              type="text"
              className="mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
              {...register("brand", {
                required: "Назва бренду обов’язкова",
                minLength: { value: 2, message: "Мінімум 2 символи" }
              })}
            />
          </label>

          {errors.brand && (
            <p className="text-red-400 text-sm mt-1">{errors.brand.message}</p>
          )}

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
          >
            Зберегти
          </button>
        </form>

      </div>
    </div>
  );
};

export { EditBrandPage };