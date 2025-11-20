import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { carService } from "../services/carService";
import { useForm } from "react-hook-form";

const EditModelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      model: "",
      brand: ""
    }
  });

  const [brands, setBrands] = useState([]);
  const [backendError, setBackendError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandsRes = await carService.getBrands();
        setBrands(brandsRes.data || []);

        const modelsRes = await carService.getModels();
        const model = (modelsRes.data || []).find((m) => m.id === parseInt(id));

        if (!model) {
          setBackendError({ detail: "Модель не знайдено." });
          return;
        }

        setValue("model", model.model);
        setValue("brand", model.brand.toString());
      } catch (err) {
        setBackendError({ detail: "Помилка при завантаженні даних." });
      }
    };

    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await carService.updateModel(id, {
        model: data.model.trim(),
        brand: parseInt(data.brand, 10)
      });

      setSuccessMessage("✅ Модель успішно оновлено!");
    } catch (err) {
      setBackendError(err.response?.data || { detail: "Помилка при оновленні моделі." });
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

        <h1 className="text-2xl font-bold text-gray-100 mb-4">Редагувати модель</h1>

        {backendError && (
          <div className="mb-4 p-3 rounded bg-red-800 text-red-200 text-sm relative">
            ⚠ {backendError.detail}
            <button
              onClick={() => setBackendError(null)}
              className="absolute top-1 right-2 hover:text-white"
            >
              ✖
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded bg-green-800 text-green-200 text-sm relative">
            {successMessage}
            <button
              onClick={() => setSuccessMessage(null)}
              className="absolute top-1 right-2 hover:text-white"
            >
              ✖
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="flex flex-col text-gray-100">
            Бренд
            <select
              className="mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
              {...register("brand", { required: "Оберіть бренд" })}
            >
              <option value="">-- Оберіть бренд --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id.toString()}>
                  {b.brand}
                </option>
              ))}
            </select>
          </label>
          {errors.brand && (
            <p className="text-red-400 text-sm mt-1">{errors.brand.message}</p>
          )}

          <label className="flex flex-col text-gray-100 mt-2">
            Назва моделі
            <input
              type="text"
              className="mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
              {...register("model", {
                required: "Назва моделі обов'язкова",
                minLength: { value: 2, message: "Мінімум 2 символи" }
              })}
            />
          </label>
          {errors.model && (
            <p className="text-red-400 text-sm mt-1">{errors.model.message}</p>
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

export { EditModelPage };