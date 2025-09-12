import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/apiService";
import { urls } from "../constants/urls";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Якщо токени вже є — редірект на профіль
  useEffect(() => {
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
      navigate("/profile");
    }
  }, [navigate]);

  const onSubmit = async (credentials) => {
    setLoading(true);

    try {
      // 1. Логін → отримуємо токени
      const tokenData = await authService.login(credentials);

      // 2. Використовуємо access токен вручну для getMe (щоб не було 401)
      const userResponse = await apiService.get(urls.auth.me, {
        headers: { Authorization: `Bearer ${tokenData.access}` },
      });
      const user = userResponse.data;

      // 3. Оновлюємо контекст
      login(user, tokenData);

      // 4. Редірект
      navigate("/profile");
    } catch (err) {
      console.error("❌ Помилка логіну:", err);

      const data = err.response?.data;
      let msg = "Помилка при логіні. Перевірте дані.";

      if (data) {
        if (data.detail) {
          msg = data.detail;
        } else if (data.non_field_errors) {
          msg = data.non_field_errors.join("\n");
        } else {
          msg = Object.values(data).flat().join("\n");
        }
      }

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Увійти
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Пароль"
            {...register("password", { required: true })}
            className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Вхід..." : "Увійти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export { LoginPage };


// Це перехідний код, з яким логінація працювала!!!!!!:
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { authService } from "../services/authService";
// import { useAuth } from "../context/AuthContext";
// import { apiService } from "../services/apiService";
//
// const LoginPage = () => {
//   const { register, handleSubmit } = useForm();
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [loading, setLoading] = useState(false);
//
//   // Якщо токени вже є — редірект на профіль
//   useEffect(() => {
//     const access = localStorage.getItem("access");
//     const refresh = localStorage.getItem("refresh");
//     console.log("🔎 useEffect перевірка токенів:", { access, refresh });
//     if (access && refresh) {
//       console.log("➡️ Токени знайдені — редірект на /profile");
//       navigate("/profile");
//     }
//   }, [navigate]);
//
//   const onSubmit = async (credentials) => {
//     setLoading(true);
//     console.log("➡️ Надсилаю дані форми:", credentials);
//
//     try {
//       const tokenData = await authService.login(credentials);
//       console.log("✅ Токени отримані:", tokenData);
//
//       // 🔹 Підсаджуємо токен у apiService перед getMe()
//       apiService.defaults.headers.common["Authorization"] = `Bearer ${tokenData.access}`;
//
//       console.log("➡️ Викликаю getMe()...");
//       const user = await authService.getMe();
//       console.log("✅ Користувач отриманий:", user);
//
//       console.log("➡️ Викликаю login() з контексту...");
//       login(user, tokenData);
//
//       console.log("➡️ Редірект на /profile");
//       navigate("/profile");
//     } catch (err) {
//       console.error("❌ Помилка логіну:", err);
//
//       const data = err.response?.data;
//       let msg = "Помилка при логіні. Перевірте дані.";
//
//       if (data) {
//         if (data.detail) {
//           msg = data.detail;
//         } else if (data.non_field_errors) {
//           msg = data.non_field_errors.join("\n");
//         } else {
//           msg = Object.values(data).flat().join("\n");
//         }
//       }
//
//       alert(msg);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm">
//         <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
//           Увійти
//         </h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//           <input
//             type="email"
//             placeholder="Email"
//             {...register("email", { required: true })}
//             className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="password"
//             placeholder="Пароль"
//             {...register("password", { required: true })}
//             className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors ${
//               loading ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? "Вхід..." : "Увійти"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
//
// export { LoginPage };





// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { authService } from "../services/authService";
// import { useAuth } from "../context/AuthContext";
//
// const LoginPage = () => {
//   const { register, handleSubmit } = useForm();
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [loading, setLoading] = useState(false);
//
//   // Якщо токени вже є — редірект на профіль
//   useEffect(() => {
//     const access = localStorage.getItem("access");
//     const refresh = localStorage.getItem("refresh");
//     if (access && refresh) {
//       navigate("/profile");
//     }
//   }, [navigate]);
//
//   const onSubmit = async (credentials) => {
//     setLoading(true);
//     try {
//       const tokenData = await authService.login(credentials);
//       const user = await authService.getMe();
//       login(user, tokenData);
//       navigate("/profile");
//     } catch (err) {
//       const data = err.response?.data;
//       let msg = "Помилка при логіні. Перевірте дані.";
//
//       if (data) {
//         if (data.detail) {
//           msg = data.detail;
//         } else if (data.non_field_errors) {
//           msg = data.non_field_errors.join("\n");
//         } else {
//           // Будь-які інші поля з помилками
//           msg = Object.values(data)
//             .flat()
//             .join("\n");
//         }
//       }
//
//       alert(msg);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm">
//         <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
//           Увійти
//         </h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//           <input
//             type="email"
//             placeholder="Email"
//             {...register("email", { required: true })}
//             className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="password"
//             placeholder="Пароль"
//             {...register("password", { required: true })}
//             className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors ${
//               loading ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? "Вхід..." : "Увійти"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
//
// export { LoginPage };


// Зверху відредагована версія, щоб співпадала з RegistrationPage.
//
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { authService } from "../services/authService";
// import { useAuth } from "../context/AuthContext";
//
// const LoginPage = () => {
//   const { register, handleSubmit } = useForm();
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//
//   // Якщо токени вже є — одразу редірект на профіль
//   useEffect(() => {
//     const access = localStorage.getItem("access");
//     const refresh = localStorage.getItem("refresh");
//     if (access && refresh) {
//       navigate("/profile");
//     }
//   }, [navigate]);
//
//   const onSubmit = async (credentials) => {
//     setError("");
//     setLoading(true);
//     try {
//       // Отримуємо токени (access + refresh)
//       const tokenData = await authService.login(credentials);
//
//       // Дістаємо юзера
//       const user = await authService.getMe();
//
//       // Зберігаємо в AuthContext
//       login(user, tokenData);
//
//       navigate("/profile");
//     } catch (err) {
//       setError("Невірний логін або пароль");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm">
//         <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
//           Увійти
//         </h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//           <input
//             type="email"
//             placeholder="Email"
//             {...register("email", { required: true })}
//             className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="password"
//             placeholder="Пароль"
//             {...register("password", { required: true })}
//             className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//
//           {error && (
//             <p className="text-red-500 text-sm text-center">{error}</p>
//           )}
//
//           <button
//             type="submit"
//             disabled={loading}
//             className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors ${
//               loading ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? "Вхід..." : "Увійти"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
//
// export { LoginPage };
//
//
//
//
// // import React, { useState } from "react";
// // import { useForm } from "react-hook-form";
// // import { useNavigate } from "react-router-dom";
// // import { authService } from "../services/authService";
// // import { useAuth } from "../context/AuthContext";
// //
// // const LoginPage = () => {
// //   const { register, handleSubmit } = useForm();
// //   const navigate = useNavigate();
// //   const { login } = useAuth();
// //   const [error, setError] = useState("");
// //
// //   const onSubmit = async (credentials) => {
// //     setError("");
// //     try {
// //       const tokenData = await authService.login(credentials);
// //       const user = await authService.getMe();
// //       login(user, tokenData);
// //       navigate("/profile");
// //     } catch (err) {
// //       setError("Невірний логін або пароль");
// //     }
// //   };
// //
// //   return (
// //     <div className="flex justify-center items-center min-h-[80vh]">
// //       <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm">
// //         <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
// //           Увійти
// //         </h2>
// //         <form
// //           onSubmit={handleSubmit(onSubmit)}
// //           className="grid gap-4"
// //         >
// //           <input
// //             type="email"
// //             placeholder="Email"
// //             {...register("email", { required: true })}
// //             className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           />
// //           <input
// //             type="password"
// //             placeholder="Пароль"
// //             {...register("password", { required: true })}
// //             className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           />
// //
// //           {error && (
// //             <p className="text-red-500 text-sm text-center">{error}</p>
// //           )}
// //
// //           <button
// //             type="submit"
// //             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors"
// //           >
// //             Увійти
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };
// //
// // export { LoginPage };