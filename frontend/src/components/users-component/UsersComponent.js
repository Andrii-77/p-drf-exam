import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { userService } from "../../services/userService";
import { UserComponent } from "../user-component/UserComponent";
import { PaginationComponent } from "../pagination-component/PaginationComponent";

const UsersComponent = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useSearchParams({ page: "1" });

  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [accountType, setAccountType] = useState("");
  const [ordering, setOrdering] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const page = query.get("page") || "1";
  const pageSize = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = { page, page_size: pageSize };

        if (role) params.role = role;
        if (isActive) params.is_active = isActive;
        if (accountType) params.account_type = accountType;
        if (ordering) params.ordering = ordering;

        const res = await userService.getAll(params);

        setUsers(res.data.data);
        setTotalPages(res.data.total_pages);
      } catch (e) {
        console.error("Помилка при завантаженні користувачів:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, role, isActive, accountType, ordering]);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setQuery({ page: "1" });
  };

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Список користувачів</h1>

        {/* 🔹 Верхня пагінація */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <PaginationComponent currentPage={+page} totalPages={totalPages} />
        </div>

        {/* 🔹 Панель фільтрів */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <select
            value={role}
            onChange={handleChange(setRole)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none border border-gray-600"
          >
            <option value="">Усі ролі</option>
            <option value="buyer">Покупці</option>
            <option value="seller">Продавці</option>
            <option value="manager">Менеджери</option>
            <option value="admin">Адміністратори</option>
          </select>

          <select
            value={accountType}
            onChange={handleChange(setAccountType)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none border border-gray-600"
          >
            <option value="">Усі типи акаунтів</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>

          <select
            value={isActive}
            onChange={handleChange(setIsActive)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none border border-gray-600"
          >
            <option value="">Усі користувачі</option>
            <option value="true">Активні</option>
            <option value="false">Неактивні</option>
          </select>

          <select
            value={ordering}
            onChange={handleChange(setOrdering)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none border border-gray-600"
          >
            <option value="">Без сортування</option>
            <option value="role">За роллю (↑)</option>
            <option value="-role">За роллю (↓)</option>
            <option value="is_active">Активність (↑)</option>
            <option value="-is_active">Активність (↓)</option>
            <option value="account_type">Тип акаунта (↑)</option>
            <option value="-account_type">Тип акаунта (↓)</option>
            <option value="email">Email (↑)</option>
            <option value="-email">Email (↓)</option>
          </select>
        </div>

        {/* 🔹 Відображення користувачів */}
        {loading ? (
          <p className="text-center text-gray-400 mt-4">Завантаження...</p>
        ) : error ? (
          <p className="text-center text-red-400 mt-4">Помилка при завантаженні користувачів.</p>
        ) : users.length > 0 ? (
          <div className="flex flex-col gap-4 mt-4">
            {users.map((user) => (
              <UserComponent key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-4">Користувачів не знайдено.</p>
        )}

        {/* 🔹 Нижня пагінація */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <PaginationComponent currentPage={+page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};

export { UsersComponent };



// // 20251028 Додаю сортування і фільтр через бекенд.
// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { userService } from "../../services/userService";
// import { UserComponent } from "../user-component/UserComponent";
// import { PaginationComponent } from "../pagination-component/PaginationComponent";
//
// const UsersComponent = ({ user }) => {
//   const [users, setUsers] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [query, setQuery] = useSearchParams({ page: "1" });
//   const [role, setRole] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//
//   const page = query.get("page") || "1";
//   const pageSize = 5;
//
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       setError(null);
//
//       try {
//         const params = { page, page_size: pageSize };
//         if (role) params.role = role;
//
//         const res = await userService.getAll(params);
//
//         setUsers(res.data.data);
//         setTotalPages(res.data.total_pages);
//       } catch (e) {
//         console.error("Помилка при завантаженні користувачів:", e);
//         setError(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchUsers();
//   }, [page, role]);
//
//   const handleRoleChange = (e) => {
//     setRole(e.target.value);
//     setQuery({ page: "1" });
//   };
//
//   return (
//     <div className="min-h-screen bg-gray-800 text-gray-100 py-10 px-4">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-center">Список користувачів</h1>
//
//         {/* 🔹 Верхня пагінація */}
//         <div className="flex justify-center items-center gap-4 mt-8">
//           <PaginationComponent currentPage={+page} totalPages={totalPages} />
//         </div>
//
//         {/* 🔹 Відступ між пагінацією та фільтром */}
//         <div className="mt-6 flex justify-center">
//           <select
//             value={role}
//             onChange={handleRoleChange}
//             className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none border border-gray-600"
//           >
//             <option value="">Усі ролі</option>
//             <option value="buyer">Покупці</option>
//             <option value="seller">Продавці</option>
//             <option value="manager">Менеджери</option>
//             <option value="admin">Адміністратори</option>
//           </select>
//         </div>
//
//         {/* 🔹 Список користувачів вертикально */}
//         {loading ? (
//           <p className="text-center text-gray-400 mt-4">Завантаження...</p>
//         ) : error ? (
//           <p className="text-center text-red-400 mt-4">Помилка при завантаженні користувачів.</p>
//         ) : users.length > 0 ? (
//           <div className="flex flex-col gap-4 mt-4">
//             {users.map((user) => (
//               <UserComponent key={user.id} user={user} />
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-400 mt-4">Користувачів не знайдено.</p>
//         )}
//
//         {/* 🔹 Нижня пагінація */}
//         <div className="flex justify-center items-center gap-4 mt-8">
//           <PaginationComponent currentPage={+page} totalPages={totalPages} />
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export { UsersComponent };