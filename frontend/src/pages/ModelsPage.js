import React, { useEffect, useState } from "react";
import { carService } from "../services/carService";
import { useNavigate } from "react-router-dom";

const ModelsPage = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [models, setModels] = useState([]);
  const [backendError, setBackendError] = useState(null);

  // Завантаження брендів
  useEffect(() => {
    carService
      .getBrands()
      .then((res) => setBrands(res.data || []))
      .catch(() =>
        setBackendError({ detail: "Помилка при завантаженні брендів." })
      );
  }, []);

  const handleBrandChange = (brandId) => {
    const numericId = parseInt(brandId, 10) || "";
    setSelectedBrand(numericId);
    setModels([]);
    setBackendError(null);

    if (numericId) {
      carService
        .getModels({ brand: numericId })
        .then((res) => setModels(res.data || []))
        .catch(() =>
          setBackendError({ detail: "Помилка при завантаженні моделей." })
        );
    }
  };

  const handleEditModel = (id) => {
    navigate(`/models/${id}/edit`);
  };

  const inputClass =
    "mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const buttonClass =
    "px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white shadow-md";

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-3xl">

        {/* 🔙 Кнопка повернення */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          ← Повернутись
        </button>

        <h1 className="text-2xl font-bold text-gray-100 mb-4 text-center">
          Моделі авто
        </h1>

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

        {/* Вибір бренду */}
        <label className="flex flex-col text-gray-100 mb-4">
          Оберіть бренд
          <select
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className={inputClass}
          >
            <option value="">-- Виберіть бренд --</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.brand}
              </option>
            ))}
          </select>
        </label>

        {!selectedBrand ? (
          <p className="text-gray-400 text-sm mb-4">
            Спершу оберіть бренд, щоб побачити моделі.
          </p>
        ) : models.length === 0 ? (
          <p className="text-gray-400 text-sm mb-4">
            Моделі для цього бренду відсутні.
          </p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-700 p-2 text-gray-100">ID</th>
                <th className="border-b border-gray-700 p-2 text-gray-100">Модель</th>
                <th className="border-b border-gray-700 p-2 text-gray-100">Дії</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.id} className="hover:bg-gray-800">
                  <td className="border-b border-gray-700 p-2 text-gray-100">{m.id}</td>
                  <td className="border-b border-gray-700 p-2 text-gray-100">{m.model}</td>
                  <td className="border-b border-gray-700 p-2">
                    <button
                      className={buttonClass}
                      onClick={() => handleEditModel(m.id)}
                    >
                      Редагувати
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export { ModelsPage };