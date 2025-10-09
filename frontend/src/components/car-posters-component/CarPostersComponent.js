// Додаю 20251009 сортування і фільтрацію на бекенді.
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { carService } from "../../services/carService";
import { PaginationComponent } from "../pagination-component/PaginationComponent";
import { CarPosterComponent } from "../car-poster-component/CarPosterComponent";

const CarPostersComponent = ({ user }) => {
  const [cars, setCars] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useSearchParams({ page: "1" });
  const [status, setStatus] = useState("");

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // "asc" або "desc"

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const page = query.get("page") || "1";

  // Завантажуємо бренди один раз
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await carService.getBrands();
        setBrands(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchBrands();
  }, []);

  // Коли вибрано бренд, запитуємо моделі цього бренду (серверний фільтр моделей)
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
        console.error(e);
      }
    };
    fetchModels();
  }, [selectedBrand]);

  // Отримання авто з бекенду (тут передаємо фільтри на сервер)
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = { page };

        if (
          (user?.role === "seller" && user?.view === "my") ||
          user?.role === "manager" ||
          user?.role === "admin"
        ) {
          if (status) params.status = status;
        }

        if (selectedBrand) params.brand = selectedBrand; // очікується id бренду
        if (selectedModel) params.model = selectedModel; // очікується id моделі

        if (sortOrder === "asc") {
          params.ordering = "price_usd";
        } else if (sortOrder === "desc") {
          params.ordering = "-price_usd";
        }

        const res = await carService.getAllCars(params);
        // очікуємо структуру: { data: [...], total_pages: N }
        setCars(res.data.data);
        setTotalPages(res.data.total_pages);
      } catch (e) {
        console.error(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [page, status, user, selectedBrand, selectedModel, sortOrder]);

  // Скидання фільтрів
  const resetFilters = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSortOrder("");
    setStatus("");
    setQuery({ page: "1" });
  };

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold text-gray-100 text-center mb-6">
        Всі доступні оголошення
      </h1>

      {/* Пагінація */}
      <div className="flex justify-center">
        <PaginationComponent currentPage={+page} totalPages={totalPages} />
      </div>

      {/* Фільтр по статусу */}
      {(user?.role === "manager" ||
        user?.role === "admin" ||
        (user?.role === "seller" && user?.view === "my")) && (
        <div className="flex flex-col gap-2">
          <label className="text-gray-800 font-medium">Фільтр по статусу:</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setQuery({ page: "1" });
            }}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Всі</option>
            <option value="draft">Чернетка</option>
            <option value="active">Активне</option>
            <option value="inactive">Неактивне</option>
          </select>
        </div>
      )}

      {/* Фільтри по бренду, моделі, сортуванню + кнопка скинути */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end flex-wrap justify-center">
        {/* Бренди */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium">Бренд:</label>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
              setQuery({ page: "1" });
            }}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Усі бренди</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.brand}
              </option>
            ))}
          </select>
        </div>

        {/* Моделі */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium">Модель:</label>
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setQuery({ page: "1" });
            }}
            disabled={!selectedBrand}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-200 disabled:cursor-not-allowed"
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
          <label className="text-gray-800 font-medium">Сортувати за ціною:</label>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setQuery({ page: "1" });
            }}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Без сортування</option>
            <option value="asc">Від дешевших до дорожчих</option>
            <option value="desc">Від дорожчих до дешевших</option>
          </select>
        </div>

        {/* Кнопка скинути фільтри */}
        <div className="flex items-center">
          <button
            onClick={resetFilters}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition"
          >
            Скинути фільтри
          </button>
        </div>
      </div>

      {/* Список авто */}
      <div className="flex flex-col items-center gap-6">
        {loading ? (
          <div className="text-gray-500 animate-pulse">Завантаження...</div>
        ) : error ? (
          <p className="text-red-400">Помилка при завантаженні авто.</p>
        ) : cars.length > 0 ? (
          cars.map((car) => (
            <div key={car.id} className="w-full max-w-xl">
              <CarPosterComponent car={car} role={user?.role} />
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center mt-4">Авто не знайдено.</p>
        )}
      </div>

      {/* Пагінація */}
      <div className="flex justify-center">
        <PaginationComponent currentPage={+page} totalPages={totalPages} />
      </div>
    </div>
  );
};

export { CarPostersComponent };




// // 20251009 Робочий варіант без фільтрації і сортування.
// import {useEffect, useState} from "react";
// import {useSearchParams} from "react-router-dom";
//
// import {carService} from "../../services/carService";
// import {PaginationComponent} from "../pagination-component/PaginationComponent";
// import {CarPosterComponent} from "../car-poster-component/CarPosterComponent";
//
// const CarPostersComponent = ({user}) => {
//     const [cars, setCars] = useState([]);
//     const [totalPages, setTotalPages] = useState(1);
//     const [query, setQuery] = useSearchParams({page: "1"});
//     const [status, setStatus] = useState("");
//
//     const page = query.get("page") || "1";
//
//     useEffect(() => {
//         const params = {page};
//
//         if (
//             (user?.role === "seller" && user?.view === "my") ||
//             user?.role === "manager" ||
//             user?.role === "admin"
//         ) {
//             if (status) params.status = status;
//         }
//
//         carService.getAllCars(params).then((res) => {
//             setCars(res.data.data);
//             setTotalPages(res.data.total_pages);
//         });
//     }, [page, status, user]);
//
//     return (
//         <div className="space-y-8">
//             {/* Заголовок */}
//             <h1 className="text-3xl font-bold text-gray-100 text-center mb-6">
//                 Всі доступні оголошення
//             </h1>
//
//             {/* Пагінація */}
//             <div className="flex justify-center">
//                 <PaginationComponent currentPage={+page} totalPages={totalPages}/>
//             </div>
//
//             {/* Фільтр */}
//             {(user?.role === "manager" ||
//                 user?.role === "admin" ||
//                 (user?.role === "seller" && user?.view === "my")) && (
//                 <div className="flex flex-col gap-2">
//                     <label className="text-gray-800 font-medium">Фільтр по статусу:</label>
//                     <select
//                         value={status}
//                         onChange={(e) => {
//                             setStatus(e.target.value);
//                             setQuery({page: "1"});
//                         }}
//                         className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                     >
//                         <option value="">Всі</option>
//                         <option value="draft">Чернетка</option>
//                         <option value="active">Активне</option>
//                         <option value="inactive">Неактивне</option>
//                     </select>
//                 </div>
//             )}
//
//             {/* Список авто */}
//             <div className="flex flex-col items-center gap-6">
//                 {cars.length > 0 ? (
//                     cars.map((car) => (
//                         <div key={car.id} className="w-full max-w-xl">
//                             <CarPosterComponent car={car} role={user?.role}/>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-gray-600 text-center mt-4">Авто не знайдено.</p>
//                 )}
//             </div>
//
//             {/* Пагінація */}
//             <div className="flex justify-center">
//                 <PaginationComponent currentPage={+page} totalPages={totalPages}/>
//             </div>
//
//         </div>
//     );
// };
//
// export {CarPostersComponent};


// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
//
// import { carService } from "../../services/carsService";
// import { PaginationComponent } from "../pagination-component/PaginationComponent";
// import { CarPosterComponent } from "../car-poster-component/CarPosterComponent";
//
// const CarPostersComponent = ({ user }) => {
//   const [cars, setCars] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [query, setQuery] = useSearchParams({ page: "1" });
//   const [status, setStatus] = useState("");
//
//   const page = query.get("page") || "1";
//
//   useEffect(() => {
//     const params = { page };
//
//     if (
//       (user?.role === "seller" && user?.view === "my") ||
//       user?.role === "manager" ||
//       user?.role === "admin"
//     ) {
//       if (status) params.status = status;
//     }
//
//     carService.getAllCars(params).then((res) => {
//       console.log("Cars data from backend:", res.data.data); // 👈 Додай
//       setCars(res.data.data);
//       setTotalPages(res.data.total_pages);
//     });
//   }, [page, status, user]);
//
//   return (
//     <div className="space-y-4">
//       {/* Фільтр доступний тільки менеджеру, адміну і продавцю у "my" */}
//       {(user?.role === "manager" ||
//         user?.role === "admin" ||
//         (user?.role === "seller" && user?.view === "my")) && (
//         <div className="flex items-center gap-2">
//           <label className="text-gray-800 font-medium">Фільтр по статусу:</label>
//           <select
//             value={status}
//             onChange={(e) => {
//               setStatus(e.target.value);
//               setQuery({ page: "1" });
//             }}
//             className="bg-white border border-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
//           >
//             <option value="">Всі</option>
//             <option value="draft">Чернетка</option>
//             <option value="active">Активне</option>
//             <option value="inactive">Неактивне</option>
//           </select>
//         </div>
//       )}
//
//       {/* Список авто */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {cars.length > 0 ? (
//           cars.map((car) => <CarPosterComponent key={car.id} car={car} />)
//         ) : (
//           <p className="text-gray-600 col-span-full text-center mt-4">
//             Авто не знайдено.
//           </p>
//         )}
//       </div>
//
//       {/* Пагінація */}
//       <PaginationComponent currentPage={+page} totalPages={totalPages} />
//     </div>
//   );
// };
//
// export { CarPostersComponent };


// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
//
// import { carService } from "../../services/carsService";
// import { PaginationComponent } from "../pagination-component/PaginationComponent";
// import { CarPosterComponent } from "../car-poster-component/CarPosterComponent";
//
// const CarPostersComponent = ({ user }) => {
//   const [cars, setCars] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//
//   const [query, setQuery] = useSearchParams({ page: "1" });
//   const [status, setStatus] = useState("");
//
//   const page = query.get("page") || "1";
//
//   useEffect(() => {
//     const params = { page };
//
//     // Додаємо фільтр по статусу тільки якщо користувач має права
//     if (
//       (user?.role === "seller" && user?.view === "my") ||
//       user?.role === "manager" ||
//       user?.role === "admin"
//     ) {
//       if (status) params.status = status;
//     }
//
//     carService.getAllCars(params).then((res) => {
//       setCars(res.data.data);              // бекенд повертає data
//       setTotalPages(res.data.total_pages); // бекенд повертає total_pages
//     });
//   }, [page, status, user]);
//
//   return (
//     <div>
//       {/* Фільтр доступний тільки менеджеру, адміну і продавцю у "my" */}
//       {(user?.role === "manager" ||
//         user?.role === "admin" ||
//         (user?.role === "seller" && user?.view === "my")) && (
//         <div style={{ marginBottom: "1rem" }}>
//           <label>Фільтр по статусу: </label>
//           <select
//             value={status}
//             onChange={(e) => {
//               setStatus(e.target.value);
//               setQuery({ page: "1" }); // при зміні статусу — повертаємось на 1 сторінку
//             }}
//           >
//             <option value="">Всі</option>
//             <option value="draft">Чернетка</option>
//             <option value="active">Активне</option>
//             <option value="inactive">Неактивне</option>
//           </select>
//         </div>
//       )}
//
//       {/* Список авто */}
//       <div>
//         {cars.length > 0 ? (
//           cars.map((car) => <CarPosterComponent key={car.id} car={car} />)
//         ) : (
//           <p>Авто не знайдено.</p>
//         )}
//       </div>
//
//       {/* Пагінація */}
//       <PaginationComponent currentPage={+page} totalPages={totalPages} />
//     </div>
//   );
// };
//
// export { CarPostersComponent };