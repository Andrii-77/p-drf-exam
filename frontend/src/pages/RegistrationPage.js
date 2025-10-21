import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { useForm } from "react-hook-form";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // серверні помилки

  const getFieldError = (field) => {
    if (!errors) return null;

    if (field.startsWith("profile.")) {
      const key = field.split(".")[1];
      return errors.profile?.[key]?.[0] || null;
    }

    return errors[field]?.[0] || null;
  };

  const inputClass = (field) =>
    `mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border focus:outline-none focus:ring-2 ${
      getFieldError(field)
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-700 focus:ring-blue-500"
    }`;

  const onSubmit = async (data) => {
    setLoading(true);
    // ❌ Не обнуляємо errors, щоб глобальні повідомлення залишались
    try {
      await userService.create({
        email: data.email,
        password: data.password,
        role: data.role,
        profile: {
          name: data.name,
          surname: data.surname,
          phone_number: data.phone_number,
        },
      });

      // 🔹 Оновлене повідомлення після реєстрації
      alert(
        "Реєстрація успішна ✅\nБудь ласка, перевірте вашу поштову скриньку, щоб підтвердити адресу та активувати акаунт."
      );
      navigate("/login");
    } catch (err) {
      console.error("❌ Registration error:", err);
      setErrors(err.response?.data || { detail: "Невідома помилка" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Реєстрація
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">

          {/* Загальні помилки */}
          {errors.non_field_errors && (
            <div className="bg-red-600 text-white text-sm p-2 rounded mb-2">
              {errors.non_field_errors.map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}

          {/* Email */}
          <label className="flex flex-col text-gray-100">
            Email
            <input
              type="email"
              {...register("email", { required: true })}
              className={inputClass("email")}
            />
            {getFieldError("email") && (
              <span className="text-red-500 text-sm">{getFieldError("email")}</span>
            )}
          </label>

          {/* Пароль */}
          <label className="flex flex-col text-gray-100">
            Пароль
            <input
              type="password"
              {...register("password", { required: true })}
              className={inputClass("password")}
            />
            {getFieldError("password") && (
              <span className="text-red-500 text-sm">{getFieldError("password")}</span>
            )}
          </label>

          {/* Роль */}
          <label className="flex flex-col text-gray-100">
            Роль
            <select
              {...register("role")}
              className={inputClass("role")}
            >
              <option value="buyer">Покупець</option>
              <option value="seller">Продавець</option>
            </select>
            {getFieldError("role") && (
              <span className="text-red-500 text-sm">{getFieldError("role")}</span>
            )}
          </label>

          {/* Ім’я */}
          <label className="flex flex-col text-gray-100">
            Ім’я
            <input
              type="text"
              {...register("name", { required: true })}
              className={inputClass("profile.name")}
            />
            {getFieldError("profile.name") && (
              <span className="text-red-500 text-sm">{getFieldError("profile.name")}</span>
            )}
          </label>

          {/* Прізвище */}
          <label className="flex flex-col text-gray-100">
            Прізвище
            <input
              type="text"
              {...register("surname", { required: true })}
              className={inputClass("profile.surname")}
            />
            {getFieldError("profile.surname") && (
              <span className="text-red-500 text-sm">{getFieldError("profile.surname")}</span>
            )}
          </label>

          {/* Телефон */}
          <label className="flex flex-col text-gray-100">
            Телефон
            <input
              type="tel"
              {...register("phone_number", { required: true })}
              className={inputClass("profile.phone_number")}
            />
            {getFieldError("profile.phone_number") && (
              <span className="text-red-500 text-sm">{getFieldError("profile.phone_number")}</span>
            )}
          </label>

          {/* Глобальна помилка */}
          {errors.detail && (
            <p className="text-red-500 text-sm text-center">{errors.detail}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors disabled:opacity-50"
          >
            {loading ? "Створення..." : "Зареєструватися"}
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-center">
          Вже маєте акаунт?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Увійдіть
          </Link>
        </p>
      </div>
    </div>
  );
};

export { RegistrationPage };





// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { userService } from "../services/usersService";
// import { useForm } from "react-hook-form";
//
// const RegistrationPage = () => {
//   const navigate = useNavigate();
//   const { register, handleSubmit } = useForm();
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({}); // серверні помилки
//
//   const getFieldError = (field) => {
//     if (!errors) return null;
//
//     if (field.startsWith("profile.")) {
//       const key = field.split(".")[1];
//       return errors.profile?.[key]?.[0] || null;
//     }
//
//     return errors[field]?.[0] || null;
//   };
//
//   const inputClass = (field) =>
//     `mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border focus:outline-none focus:ring-2 ${
//       getFieldError(field)
//         ? "border-red-500 focus:ring-red-500"
//         : "border-gray-700 focus:ring-blue-500"
//     }`;
//
//   const onSubmit = async (data) => {
//     setLoading(true);
//     // ❌ Не обнуляємо errors, щоб глобальні повідомлення залишались
//     try {
//       await userService.create({
//         email: data.email,
//         password: data.password,
//         role: data.role,
//         profile: {
//           name: data.name,
//           surname: data.surname,
//           phone_number: data.phone_number,
//         },
//       });
//
//       alert("Реєстрація успішна ✅");
//       navigate("/login");
//     } catch (err) {
//       console.error("❌ Registration error:", err);
//       setErrors(err.response?.data || { detail: "Невідома помилка" });
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
//           Реєстрація
//         </h1>
//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//
//           {/* Загальні помилки */}
//           {errors.non_field_errors && (
//             <div className="bg-red-600 text-white text-sm p-2 rounded mb-2">
//               {errors.non_field_errors.map((err, idx) => (
//                 <p key={idx}>{err}</p>
//               ))}
//             </div>
//           )}
//
//           {/* Email */}
//           <label className="flex flex-col text-gray-100">
//             Email
//             <input
//               type="email"
//               {...register("email", { required: true })}
//               className={inputClass("email")}
//             />
//             {getFieldError("email") && (
//               <span className="text-red-500 text-sm">{getFieldError("email")}</span>
//             )}
//           </label>
//
//           {/* Пароль */}
//           <label className="flex flex-col text-gray-100">
//             Пароль
//             <input
//               type="password"
//               {...register("password", { required: true })}
//               className={inputClass("password")}
//             />
//             {getFieldError("password") && (
//               <span className="text-red-500 text-sm">{getFieldError("password")}</span>
//             )}
//           </label>
//
//           {/* Роль */}
//           <label className="flex flex-col text-gray-100">
//             Роль
//             <select
//               {...register("role")}
//               className={inputClass("role")}
//             >
//               <option value="buyer">Покупець</option>
//               <option value="seller">Продавець</option>
//             </select>
//             {getFieldError("role") && (
//               <span className="text-red-500 text-sm">{getFieldError("role")}</span>
//             )}
//           </label>
//
//           {/* Ім’я */}
//           <label className="flex flex-col text-gray-100">
//             Ім’я
//             <input
//               type="text"
//               {...register("name", { required: true })}
//               className={inputClass("profile.name")}
//             />
//             {getFieldError("profile.name") && (
//               <span className="text-red-500 text-sm">{getFieldError("profile.name")}</span>
//             )}
//           </label>
//
//           {/* Прізвище */}
//           <label className="flex flex-col text-gray-100">
//             Прізвище
//             <input
//               type="text"
//               {...register("surname", { required: true })}
//               className={inputClass("profile.surname")}
//             />
//             {getFieldError("profile.surname") && (
//               <span className="text-red-500 text-sm">{getFieldError("profile.surname")}</span>
//             )}
//           </label>
//
//           {/* Телефон */}
//           <label className="flex flex-col text-gray-100">
//             Телефон
//             <input
//               type="tel"
//               {...register("phone_number", { required: true })}
//               className={inputClass("profile.phone_number")}
//             />
//             {getFieldError("profile.phone_number") && (
//               <span className="text-red-500 text-sm">{getFieldError("profile.phone_number")}</span>
//             )}
//           </label>
//
//           {/* Глобальна помилка */}
//           {errors.detail && (
//             <p className="text-red-500 text-sm text-center">{errors.detail}</p>
//           )}
//
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors disabled:opacity-50"
//           >
//             {loading ? "Створення..." : "Зареєструватися"}
//           </button>
//         </form>
//
//         <p className="text-gray-300 mt-4 text-center">
//           Вже маєте акаунт?{" "}
//           <Link to="/login" className="text-blue-400 hover:underline">
//             Увійдіть
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };
//
// export { RegistrationPage };



// // Зверху форма для реєстрації для мого проекту, де все заповнюється відразу. Це демонстраційна версія.
//
// // Тут початкова версія реєстрації, коли профіль заповнюється пізніше, а не відразу.
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
//
// const RegistrationPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("buyer");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       // TODO: запит до /users на створення юзера
//       alert("Реєстрація ще не підключена до бекенду.");
//     } catch (err) {
//       setError("Помилка реєстрації.");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
//           Реєстрація
//         </h1>
//         <form
//           onSubmit={handleSubmit}
//           className="grid gap-4"
//         >
//           <label className="flex flex-col text-gray-100">
//             Email
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </label>
//           <label className="flex flex-col text-gray-100">
//             Пароль
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </label>
//           <label className="flex flex-col text-gray-100">
//             Роль
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="buyer">Покупець</option>
//               <option value="seller">Продавець</option>
//             </select>
//           </label>
//
//           {error && (
//             <p className="text-red-500 text-sm text-center">{error}</p>
//           )}
//
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors disabled:opacity-50"
//           >
//             {loading ? "Створення..." : "Зареєструватися"}
//           </button>
//         </form>
//         <p className="text-gray-300 mt-4 text-center">
//           Вже маєте акаунт?{" "}
//           <Link to="/login" className="text-blue-400 hover:underline">
//             Увійдіть
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };
//
// export { RegistrationPage };