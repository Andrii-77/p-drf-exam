import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { carService } from "../services/carService";

const BrandsPage = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [backendError, setBackendError] = useState(null);

  // Завантаження брендів з API
  useEffect(() => {
    carService
      .getBrands()
      .then((res) => setBrands(res.data || []))
      .catch(() =>
        setBackendError({ detail: "Помилка при завантаженні брендів." })
      );
  }, []);

  // Перехід на редагування бренду
  const handleEditBrand = (id) => {
    navigate(`/brands/${id}/edit`);
  };

  return (
    <div className="p-4 min-h-[80vh]">
      {/* Кнопка назад */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
      >
        ⬅ Повернутись
      </button>

      <h1 className="text-2xl font-bold mb-4 text-gray-100">Бренди авто</h1>

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

      <table className="w-full border-collapse text-gray-100">
        <thead>
          <tr className="bg-gray-800">
            <th className="border border-gray-700 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-700 px-4 py-2 text-left">Бренд</th>
            <th className="border border-gray-700 px-4 py-2 text-center">Дії</th>
          </tr>
        </thead>
        <tbody>
          {brands.length > 0 ? (
            brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-700/50">
                <td className="border border-gray-700 px-4 py-2">{brand.id}</td>
                <td className="border border-gray-700 px-4 py-2">{brand.brand}</td>
                <td className="border border-gray-700 px-4 py-2 flex justify-center">
                  <button
                    onClick={() => handleEditBrand(brand.id)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white text-sm"
                  >
                    Редагувати
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4 text-gray-400">
                Немає брендів для відображення
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export { BrandsPage };