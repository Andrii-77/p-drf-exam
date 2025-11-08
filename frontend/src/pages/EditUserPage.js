import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { useAuth } from "../context/AuthContext";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [userData, setUserData] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const inputClass =
    "mt-1 px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

  // === Завантаження користувача для редагування ===
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const { data } = await userService.getById(id);
        setUserData(data);

        setValue("email", data.email || "");
        setValue("role", data.role || "");
        setValue("account_type", data.account_type || "basic");
        setValue("is_active", data.is_active);
        if (data.profile) {
          setValue("name", data.profile.name || "");
          setValue("surname", data.profile.surname || "");
          setValue("phone_number", data.profile.phone_number || "");
        }
      } catch (err) {
        console.error("Помилка при завантаженні користувача:", err);
        setBackendError({
          detail: "⚠ Не вдалося завантажити дані користувача.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, setValue]);

  // === Сабміт форми ===
  const onSubmit = async (data) => {
    try {
      setBackendError(null);
      setSuccessMessage(null);

      const preparedData = {
        email: data.email,
        role: data.role,
        account_type: data.account_type,
        is_active: data.is_active,
        profile: {
          name: data.name,
          surname: data.surname,
          phone_number: data.phone_number,
        },
      };

      // === Визначення змінених полів ===
      const changedFields = [];
      const compareSimple = ["email", "role", "account_type", "is_active"];
      compareSimple.forEach((field) => {
        if (String(preparedData[field]) !== String(userData[field])) {
          changedFields.push(field);
        }
      });

      if (userData.profile) {
        const profileFields = ["name", "surname", "phone_number"];
        profileFields.forEach((pf) => {
          if (
            String(preparedData.profile[pf]) !==
            String(userData.profile[pf] || "")
          ) {
            changedFields.push(pf);
          }
        });
      }

      const res = await userService.update(id, preparedData);

      let message = res.data?.message || "✅ Дані користувача успішно оновлено.";
      if (changedFields.length > 0) {
        message += ` Змінено поля: ${changedFields.join(", ")}.`;
      } else {
        message += " Дані не змінено.";
      }

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

  // ✅ Після підтвердження успіху — повертаємося на сторінку користувача
  const handleCloseSuccess = () => {
    setSuccessMessage(null);
    navigate(`/users/${id}`, { state: { fromEdit: true } });
  };

  if (loading) {
    return <p className="text-gray-400 text-center mt-10">Завантаження...</p>;
  }

  if (!userData) {
    return (
      <p className="text-red-400 text-center mt-10">
        Не вдалося отримати дані користувача.
      </p>
    );
  }

  // === Обмеження для звичайного користувача ===
  const isManagerOrAdmin =
    currentUser?.role === "manager" || currentUser?.role === "admin";
  const isSelf = parseInt(currentUser?.id) === parseInt(id);
  const isBuyerOrSeller =
    currentUser?.role === "buyer" || currentUser?.role === "seller";

  // === Ролі для вибору ===
  const availableRoles = isManagerOrAdmin
    ? ["buyer", "seller", "manager", "admin"]
    : ["buyer", "seller"];

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          ✏️ Редагування користувача
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
          {/* Email */}
          <label className="flex flex-col text-gray-100">
            Email
            <input
              type="email"
              {...register("email", { required: true })}
              className={inputClass}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                Вкажіть електронну адресу
              </span>
            )}
          </label>

          {/* Роль */}
          <label className="flex flex-col text-gray-100">
            Роль
            <select {...register("role", { required: true })} className={inputClass}>
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          {/* Тип акаунту — показуємо лише менеджеру або адміну */}
          {isManagerOrAdmin && watch("role") === "seller" && (
            <label className="flex flex-col text-gray-100">
              Тип акаунту
              <select {...register("account_type")} className={inputClass}>
                <option value="basic">Базовий</option>
                <option value="premium">Преміум</option>
              </select>
            </label>
          )}

          {/* Активність — лише для менеджера/адміна */}
          {isManagerOrAdmin && (
            <label className="flex flex-col text-gray-100">
              Активний
              <select {...register("is_active")} className={inputClass}>
                <option value={true}>Так</option>
                <option value={false}>Ні</option>
              </select>
            </label>
          )}

          {/* Ім’я */}
          <label className="flex flex-col text-gray-100">
            Ім’я
            <input type="text" {...register("name")} className={inputClass} />
          </label>

          {/* Прізвище */}
          <label className="flex flex-col text-gray-100">
            Прізвище
            <input type="text" {...register("surname")} className={inputClass} />
          </label>

          {/* Телефон */}
          <label className="flex flex-col text-gray-100">
            Телефон
            <input
              type="text"
              {...register("phone_number")}
              className={inputClass}
            />
          </label>

          {/* === Кнопка збереження === */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors"
          >
            💾 Зберегти зміни
          </button>

          {/* === Кнопка зміни пароля (заглушка) === */}
          {isSelf && (
            <button
              type="button"
              onClick={() => alert("🔐 Зміна пароля буде доступна пізніше")}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded shadow transition-colors"
            >
              🔑 Змінити пароль
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export { EditUserPage };



// // 20251108 Удосконалюю цю сторінку. Новий код зверху.
// import React, {useEffect, useState} from "react";
// import {useForm} from "react-hook-form";
// import {useParams, useNavigate} from "react-router-dom";
// import {userService} from "../services/userService";
// import {useAuth} from "../context/AuthContext";
//
// const EditUserPage = () => {
//     const {id} = useParams();
//     const navigate = useNavigate();
//     const {user: currentUser} = useAuth();
//
//     const {
//         register,
//         handleSubmit,
//         setValue,
//         watch,
//         formState: {errors},
//     } = useForm();
//
//     const [userData, setUserData] = useState(null);
//     const [backendError, setBackendError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState(null);
//     const [loading, setLoading] = useState(true);
//
//     const inputClass =
//         "mt-1 px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";
//
//     // === Завантаження користувача для редагування ===
//     useEffect(() => {
//         if (!id) return;
//
//         const fetchUser = async () => {
//             try {
//                 const {data} = await userService.getById(id);
//                 setUserData(data);
//
//                 setValue("email", data.email || "");
//                 setValue("role", data.role || "");
//                 setValue("account_type", data.account_type || "basic");
//                 setValue("is_active", data.is_active);
//                 if (data.profile) {
//                     setValue("name", data.profile.name || "");
//                     setValue("surname", data.profile.surname || "");
//                     setValue("phone_number", data.profile.phone_number || "");
//                 }
//             } catch (err) {
//                 console.error("Помилка при завантаженні користувача:", err);
//                 setBackendError({
//                     detail: "⚠ Не вдалося завантажити дані користувача.",
//                 });
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchUser();
//     }, [id, setValue]);
//
//     // === Сабміт форми ===
//     const onSubmit = async (data) => {
//         try {
//             setBackendError(null);
//             setSuccessMessage(null);
//
//             const preparedData = {
//                 email: data.email,
//                 role: data.role,
//                 account_type: data.account_type,
//                 is_active: data.is_active,
//                 profile: {
//                     name: data.name,
//                     surname: data.surname,
//                     phone_number: data.phone_number,
//                 },
//             };
//
//             const res = await userService.update(id, preparedData);
//             const message = res.data?.message || "✅ Дані користувача успішно оновлено.";
//             setSuccessMessage(message);
//         } catch (err) {
//             if (err.response?.data) {
//                 setBackendError(err.response.data);
//             } else {
//                 setBackendError({
//                     detail: "⚠ Виникла невідома помилка при оновленні.",
//                 });
//             }
//         }
//     };
//
//     // ✅ Після підтвердження успіху — повертаємося на сторінку користувача
//     const handleCloseSuccess = () => {
//         setSuccessMessage(null);
//         navigate(`/users/${id}`, {state: {fromEdit: true}});
//     };
//
//     if (loading) {
//         return <p className="text-gray-400 text-center mt-10">Завантаження...</p>;
//     }
//
//     if (!userData) {
//         return (
//             <p className="text-red-400 text-center mt-10">
//                 Не вдалося отримати дані користувача.
//             </p>
//         );
//     }
//
//     // === Обмеження для звичайного користувача ===
//     const isManagerOrAdmin =
//         currentUser?.role === "manager" || currentUser?.role === "admin";
//     const isSelf = parseInt(currentUser?.id) === parseInt(id);
//
//     // === Ролі для вибору ===
//     const availableRoles = isManagerOrAdmin
//         ? ["buyer", "seller", "manager", "admin"]
//         : ["buyer", "seller"];
//
//     return (
//         <div className="flex justify-center items-center min-h-[80vh] px-4">
//             <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-lg">
//                 <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
//                     ✏️ Редагування користувача
//                 </h1>
//
//                 {/* ✅ Повідомлення успіху */}
//                 {successMessage && (
//                     <div className="mb-4 p-3 rounded bg-green-800 text-green-200 relative">
//                         {successMessage}
//                         <button
//                             onClick={handleCloseSuccess}
//                             className="absolute top-1 right-2 hover:text-white"
//                         >
//                             ✖
//                         </button>
//                     </div>
//                 )}
//
//                 {/* ✅ Повідомлення про помилки */}
//                 {backendError && (
//                     <div className="mb-4 p-3 rounded bg-red-800 text-red-200 text-sm relative">
//                         {backendError.detail && <p>{backendError.detail}</p>}
//                         {Object.keys(backendError).map(
//                             (field) =>
//                                 field !== "detail" && (
//                                     <p key={field}>
//                                         ⚠ {field}: {backendError[field]}
//                                     </p>
//                                 )
//                         )}
//                         <button
//                             onClick={() => setBackendError(null)}
//                             className="absolute top-1 right-2 hover:text-white"
//                         >
//                             ✖
//                         </button>
//                     </div>
//                 )}
//
//                 {/* === Форма редагування === */}
//                 <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//                     {/* Email */}
//                     <label className="flex flex-col text-gray-100">
//                         Email
//                         <input
//                             type="email"
//                             {...register("email", {required: true})}
//                             className={inputClass}
//                         />
//                         {errors.email && (
//                             <span className="text-red-500 text-sm">
//                 Вкажіть електронну адресу
//               </span>
//                         )}
//                     </label>
//
//                     {/* Роль */}
//                     <label className="flex flex-col text-gray-100">
//                         Роль
//                         <select {...register("role", {required: true})} className={inputClass}>
//                             {availableRoles.map((r) => (
//                                 <option key={r} value={r}>
//                                     {r}
//                                 </option>
//                             ))}
//                         </select>
//                     </label>
//
//                     {/* Тип акаунту — показуємо лише, якщо роль = seller */}
//                     {watch("role") === "seller" && (
//                         <label className="flex flex-col text-gray-100">
//                             Тип акаунту
//                             <select
//                                 {...register("account_type")}
//                                 className={inputClass}
//                                 disabled={!isManagerOrAdmin}
//                             >
//                                 <option value="basic">Базовий</option>
//                                 <option value="premium">Преміум</option>
//                             </select>
//                         </label>
//                     )}
//
//                     {/* Активність */}
//                     <label className="flex flex-col text-gray-100">
//                         Активний
//                         <select
//                             {...register("is_active")}
//                             className={inputClass}
//                             disabled={!isManagerOrAdmin}
//                         >
//                             <option value={true}>Так</option>
//                             <option value={false}>Ні</option>
//                         </select>
//                     </label>
//
//                     {/* Ім’я */}
//                     <label className="flex flex-col text-gray-100">
//                         Ім’я
//                         <input type="text" {...register("name")} className={inputClass}/>
//                     </label>
//
//                     {/* Прізвище */}
//                     <label className="flex flex-col text-gray-100">
//                         Прізвище
//                         <input type="text" {...register("surname")} className={inputClass}/>
//                     </label>
//
//                     {/* Телефон */}
//                     <label className="flex flex-col text-gray-100">
//                         Телефон
//                         <input type="text" {...register("phone_number")} className={inputClass}/>
//                     </label>
//
//                     {/* === Кнопка збереження === */}
//                     <button
//                         type="submit"
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors"
//                     >
//                         💾 Зберегти зміни
//                     </button>
//
//                     {/* === Кнопка зміни пароля (заглушка) === */}
//                     {isSelf && (
//                         <button
//                             type="button"
//                             onClick={() => alert("🔐 Зміна пароля буде доступна пізніше")}
//                             className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded shadow transition-colors"
//                         >
//                             🔑 Змінити пароль
//                         </button>
//                     )}
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export {EditUserPage};