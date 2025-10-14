import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { carService } from "../services/carService";
import { useAuth } from "../context/AuthContext";

const EditCarPosterPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors },
  } = useForm();

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [backendError, setBackendError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // === Завантаження брендів ===
  useEffect(() => {
    carService
      .getBrands()
      .then((res) => setBrands(res.data || []))
      .catch(() =>
        setBackendError({ detail: "⚠ Не вдалося завантажити список брендів." })
      );
  }, []);

  // === Завантаження даних авто для редагування ===
  useEffect(() => {
    if (!id) return;

    const fetchCar = async () => {
      try {
        const res = await carService.getCarById(id);
        const car = res.data;

        // заповнення форми
        setValue("brand", car.brand?.id || "");
        setValue("model", car.model?.id || "");
        setValue("description", car.description || "");
        setValue("original_price", car.original_price || "");
        setValue("original_currency", car.original_currency || "UAH");
        setValue("location", car.location || "");

        if (car.brand?.id) {
          setSelectedBrand(car.brand.id);
          const modelsRes = await carService.getModels({ brand: car.brand.id });
          setModels(modelsRes.data || []);
        }
      } catch (err) {
        setBackendError({ detail: "⚠ Не вдалося завантажити дані авто." });
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, setValue]);

  // === При зміні бренду підтягувати моделі ===
  const handleBrandChange = (brandId) => {
    const numericId = parseInt(brandId, 10);
    setSelectedBrand(numericId);
    resetField("model");
    setModels([]);

    if (numericId) {
      carService
        .getModels({ brand: numericId })
        .then((res) => setModels(res.data || []))
        .catch(() =>
          setBackendError({ detail: "⚠ Помилка при завантаженні моделей." })
        );
    }
  };

  // === Сабміт форми ===
  const onSubmit = async (data) => {
    try {
      setBackendError(null);
      setSuccessMessage(null);

      const preparedData = {
        brand_id: data.brand ? parseInt(data.brand, 10) : null,
        model_id: data.model ? parseInt(data.model, 10) : null,
        description: data.description || "",
        original_price: data.original_price
          ? parseFloat(data.original_price)
          : 0,
        original_currency: data.original_currency || "UAH",
        location: data.location || "",
      };

      const res = await carService.updateCar(id, preparedData);
      const message =
        res.data?.message || "✅ Оголошення успішно оновлено.";

      setSuccessMessage(message);
    } catch (err) {
      if (err.response?.data) {
        setBackendError(err.response.data);
      } else {
        setBackendError({
          detail: "⚠ Виникла невідома помилка при оновленні.",
        });
      }
    }
  };

  const handleCloseSuccess = () => {
    setSuccessMessage(null);
    navigate(`/cars/${id}`);
  };

  if (loading) {
    return <p className="text-gray-400 text-center">Завантаження...</p>;
  }

  const inputClass =
    "mt-1 px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          ✏️ Редагування оголошення
        </h1>

        {/* ✅ Повідомлення успіху */}
        {successMessage && (
          <div className="mb-4 p-3 rounded bg-green-800 text-green-200 relative">
            {successMessage}
            <button
              onClick={handleCloseSuccess}
              className="absolute top-1 right-2 hover:text-white"
            >
              ✖
            </button>
          </div>
        )}

        {/* ✅ Повідомлення про помилки */}
        {backendError && (
          <div className="mb-4 p-3 rounded bg-red-800 text-red-200 text-sm relative">
            {backendError.detail && <p>{backendError.detail}</p>}
            {Object.keys(backendError).map(
              (field) =>
                field !== "detail" && (
                  <p key={field}>
                    ⚠ {field}: {backendError[field]}
                  </p>
                )
            )}
            <button
              onClick={() => setBackendError(null)}
              className="absolute top-1 right-2 hover:text-white"
            >
              ✖
            </button>
          </div>
        )}

        {/* === Форма редагування === */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* === Бренд === */}
          <label className="flex flex-col text-gray-100">
            Бренд
            <select
              {...register("brand", { required: true })}
              className={inputClass}
              onChange={(e) => handleBrandChange(e.target.value)}
            >
              <option value="">-- Виберіть бренд --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.brand}
                </option>
              ))}
            </select>
            {errors.brand && (
              <span className="text-red-500 text-sm">
                Виберіть бренд авто
              </span>
            )}
          </label>

          {/* === Модель === */}
          {selectedBrand && (
            <label className="flex flex-col text-gray-100">
              Модель
              <select
                {...register("model", { required: true })}
                className={inputClass}
              >
                <option value="">-- Виберіть модель --</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.model}
                  </option>
                ))}
              </select>
              {errors.model && (
                <span className="text-red-500 text-sm">
                  Виберіть модель авто
                </span>
              )}
            </label>
          )}

          {/* === Опис === */}
          <label className="flex flex-col text-gray-100">
            Опис
            <textarea
              {...register("description", { required: true })}
              className={inputClass}
              rows={4}
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                Вкажіть опис оголошення
              </span>
            )}
          </label>

          {/* === Ціна === */}
          <label className="flex flex-col text-gray-100">
            Ціна
            <input
              type="number"
              step="0.01"
              {...register("original_price", { required: true })}
              className={inputClass}
            />
            {errors.original_price && (
              <span className="text-red-500 text-sm">
                Вкажіть початкову ціну
              </span>
            )}
          </label>

          {/* === Валюта === */}
          <label className="flex flex-col text-gray-100">
            Валюта
            <select
              {...register("original_currency", { required: true })}
              className={inputClass}
            >
              <option value="UAH">₴ Гривня</option>
              <option value="USD">$ Долар</option>
              <option value="EUR">€ Євро</option>
            </select>
          </label>

          {/* === Локація === */}
          <label className="flex flex-col text-gray-100">
            Локація
            <input
              type="text"
              {...register("location", { required: true })}
              className={inputClass}
            />
            {errors.location && (
              <span className="text-red-500 text-sm">
                Вкажіть місце розташування
              </span>
            )}
          </label>

          {/* === Кнопка === */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors"
          >
            💾 Зберегти зміни
          </button>
        </form>
      </div>
    </div>
  );
};

export { EditCarPosterPage };