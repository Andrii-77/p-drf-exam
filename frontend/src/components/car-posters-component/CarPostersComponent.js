import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { carService } from "../../services/carsService";
import { PaginationComponent } from "../pagination-component/PaginationComponent";
import { CarPosterComponent } from "../car-poster-component/CarPosterComponent";

const CarPostersComponent = ({ user }) => {
  const [cars, setCars] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useSearchParams({ page: "1" });
  const [status, setStatus] = useState("");

  const page = query.get("page") || "1";

  useEffect(() => {
    const params = { page };

    if (
      (user?.role === "seller" && user?.view === "my") ||
      user?.role === "manager" ||
      user?.role === "admin"
    ) {
      if (status) params.status = status;
    }

    carService.getAllCars(params).then((res) => {
      setCars(res.data.data);
      setTotalPages(res.data.total_pages);
    });
  }, [page, status, user]);

  return (
    <div className="space-y-4">
      {/* Фільтр доступний тільки менеджеру, адміну і продавцю у "my" */}
      {(user?.role === "manager" ||
        user?.role === "admin" ||
        (user?.role === "seller" && user?.view === "my")) && (
        <div className="flex items-center gap-2">
          <label className="text-gray-800 font-medium">Фільтр по статусу:</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setQuery({ page: "1" });
            }}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            <option value="">Всі</option>
            <option value="draft">Чернетка</option>
            <option value="active">Активне</option>
            <option value="inactive">Неактивне</option>
          </select>
        </div>
      )}

      {/* Список авто */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.length > 0 ? (
          cars.map((car) => <CarPosterComponent key={car.id} car={car} />)
        ) : (
          <p className="text-gray-600 col-span-full text-center mt-4">
            Авто не знайдено.
          </p>
        )}
      </div>

      {/* Пагінація */}
      <PaginationComponent currentPage={+page} totalPages={totalPages} />
    </div>
  );
};

export { CarPostersComponent };




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