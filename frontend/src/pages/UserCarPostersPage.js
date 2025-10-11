import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { carService } from "../services/carService";
import { PaginationComponent } from "../components/pagination-component/PaginationComponent";
import { CarPosterComponent } from "../components/car-poster-component/CarPosterComponent";

const UserCarPostersPage = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useSearchParams({ page: "1" });

  const [status, setStatus] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtersChanged, setFiltersChanged] = useState(false);

  const page = query.get("page") || "1";

  // 🔹 Завантаження брендів
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await carService.getBrands();
        setBrands(res.data);
      } catch (e) {
        console.error("Помилка при завантаженні брендів:", e);
      }
    };
    fetchBrands();
  }, []);

  // 🔹 Завантаження моделей при зміні бренду
  useEffect(() => {
    const fetchModels = async () => {
      try {
        if (selectedBrand) {
          const res = await carService.getModels({ brand: selectedBrand });
          setModels(res.data);
        } else {
          const res = await carService.getModels();
          setModels(res.data);
        }
      } catch (e) {
        console.error("Помилка при завантаженні моделей:", e);
      }
    };
    fetchModels();
  }, [selectedBrand]);

  // 🔹 Завантаження авто користувача
  useEffect(() => {
    const fetchUserCars = async () => {
      if (!user?.id) return;

      if (filtersChanged && page !== "1") {
        setQuery({ page: "1" });
        setFiltersChanged(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = { page };

        if (status) params.status = status;
        if (selectedBrand) params.brand = selectedBrand;
        if (selectedModel) params.model = selectedModel;

        if (sortOrder === "asc") params.ordering = "price_usd";
        else if (sortOrder === "desc") params.ordering = "-price_usd";

        const res = await carService.getUserCars(user.id, params);

        setCars(res.data.data || []);
        setTotalPages(res.data.total_pages || 1);
      } catch (e) {
        if (e.response?.status === 404) {
          // 🔹 Якщо сторінка порожня — це не помилка
          console.warn("Порожня сторінка або немає результатів");
          setCars([]);
          setTotalPages(1);
        } else {
          console.error("❌ [Error loading user cars]", e);
          setError(e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, status, selectedBrand, selectedModel, sortOrder, filtersChanged]);

  // 🔹 Скидання фільтрів
  const resetFilters = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSortOrder("");
    setStatus("");
    setFiltersChanged(false);
    setQuery({ page: "1" });
  };

  return (
    <div className="space-y-8 bg-gray-900 min-h-screen py-8 px-4 text-gray-100">
      <h1 className="text-3xl font-semibold text-center mb-6 text-white">
        Мої оголошення
      </h1>

      {/* Пагінація зверху */}
      <div className="flex justify-center">
        <PaginationComponent currentPage={+page} totalPages={totalPages} />
      </div>

      {/* Фільтри */}
      <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 items-start md:items-end bg-gray-800 p-5 rounded-2xl shadow-md border border-gray-700">
        {/* Статус */}
        <div className="flex flex-col">
          <label className="text-gray-300 font-medium">Фільтр по статусу:</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setFiltersChanged(true);
            }}
            className="bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Всі статуси</option>
            <option value="draft">Чернетка</option>
            <option value="active">Активне</option>
            <option value="inactive">Неактивне</option>
          </select>
        </div>

        {/* Бренд */}
        <div className="flex flex-col">
          <label className="text-gray-300 font-medium">Бренд:</label>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
              setFiltersChanged(true);
            }}
            className="bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Усі бренди</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.brand}
              </option>
            ))}
          </select>
        </div>

        {/* Модель */}
        <div className="flex flex-col">
          <label className="text-gray-300 font-medium">Модель:</label>
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setFiltersChanged(true);
            }}
            disabled={!selectedBrand}
            className="bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <option value="">Усі моделі</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.model}
              </option>
            ))}
          </select>
        </div>

        {/* Сортування */}
        <div className="flex flex-col">
          <label className="text-gray-300 font-medium">Сортувати за ціною:</label>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setFiltersChanged(true);
            }}
            className="bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Без сортування</option>
            <option value="asc">Від дешевших до дорожчих</option>
            <option value="desc">Від дорожчих до дешевших</option>
          </select>
        </div>

        {/* Скинути фільтри */}
        <div className="flex items-center">
          <button
            onClick={resetFilters}
            className="bg-gray-700 text-gray-200 px-4 py-2 rounded-xl shadow hover:bg-gray-600 transition"
          >
            Скинути фільтри
          </button>
        </div>
      </div>

      {/* Список авто */}
      <div className="flex flex-col items-center gap-6">
        {loading ? (
          <div className="text-gray-400 animate-pulse">Завантаження...</div>
        ) : error ? (
          <p className="text-red-400">Помилка при завантаженні авто.</p>
        ) : cars.length > 0 ? (
          cars.map((car) => (
            <div key={car.id} className="w-full max-w-xl">
              <CarPosterComponent car={car} role={user?.role} />
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-4">
            Авто не знайдено для обраних фільтрів.
          </p>
        )}
      </div>

      {/* Пагінація знизу */}
      <div className="flex justify-center">
        <PaginationComponent currentPage={+page} totalPages={totalPages} />
      </div>
    </div>
  );
};

export { UserCarPostersPage };