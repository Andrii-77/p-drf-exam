// import React from "react";
// import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
// import {UserDetailsPage} from "./UserDetailsPage";
//
// const ProfilePage = () => {
//   const { user, isAuthenticated } = useAuth();
//
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
//
//   return (
//     <div className="p-4">
//       <UserDetailsPage userData={user} />
//     </div>
//   );
// };
//
// export { ProfilePage };


// 20251021 Змінюю це по пропозиції ШІ.
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const displayName =
    user?.profile?.name || (user?.role === "admin" ? "Адміністраторе" : "Користувачу");

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-800 p-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Привіт, {displayName}! 👋
        </h2>

        <div className="grid gap-3 mb-6 text-gray-300">
          <p>
            <strong className="text-gray-100">Логін:</strong> {user?.email}
          </p>
          {user?.profile?.name && (
            <p>
              <strong className="text-gray-100">Ім'я:</strong> {user.profile.name}
            </p>
          )}
          <p>
            <strong className="text-gray-100">Роль:</strong> {user?.role}
          </p>
          {user?.account_type && (
            <p>
              <strong className="text-gray-100">Тип акаунту:</strong> {user.account_type}
            </p>
          )}
        </div>

        {/*<button*/}
        {/*  onClick={logout}*/}
        {/*  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"*/}
        {/*>*/}
        {/*  Вийти*/}
        {/*</button>*/}
      </div>
    </div>
  );
};

export { ProfilePage };



// import React from "react";
// import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
//
// const ProfilePage = () => {
//   const { user, isAuthenticated, logout } = useAuth();
//
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
//
//   // Визначаємо ім'я для привітання
//   const displayName = user?.profile?.name || (user?.role === "admin" ? "Адміністраторе" : "Користувачу");
//
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         backgroundColor: "#f9fafb",
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: "white",
//           padding: "32px",
//           borderRadius: "12px",
//           boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//           width: "100%",
//           maxWidth: "500px",
//         }}
//       >
//         <h2
//           style={{
//             fontSize: "1.5rem",
//             fontWeight: "bold",
//             marginBottom: "20px",
//             textAlign: "center",
//             color: "#1f2937",
//           }}
//         >
//           Привіт, {displayName}! 👋
//         </h2>
//
//         <div
//           style={{
//             display: "grid",
//             gap: "10px",
//             marginBottom: "20px",
//             color: "#374151",
//           }}
//         >
//           <p>
//             <strong>Логін:</strong> {user?.email}
//           </p>
//           {user?.profile?.name && (
//             <p>
//               <strong>Ім'я:</strong> {user.profile.name}
//             </p>
//           )}
//           <p>
//             <strong>Роль:</strong> {user?.role}
//           </p>
//           {user?.account_type && (
//             <p>
//               <strong>Тип акаунту:</strong> {user.account_type}
//             </p>
//           )}
//         </div>
//
//         <button
//           onClick={logout}
//           style={{
//             padding: "10px 16px",
//             borderRadius: "8px",
//             backgroundColor: "#dc2626",
//             color: "white",
//             fontWeight: "bold",
//             cursor: "pointer",
//             border: "none",
//             width: "100%",
//           }}
//         >
//           Вийти
//         </button>
//       </div>
//     </div>
//   );
// };
//
// export { ProfilePage };
//
//
// // const ProfilePage = () => {
// //     return (
// //         <div>
// //             <div>ProfilePage</div>
// //         </div>
// //     );
// // };
// //
// // export {ProfilePage};
//
// // import React from "react";
// // import {useAuth} from "../context/AuthContext";
// // import {Navigate} from "react-router-dom";
// //
// // const ProfilePage = () => {
// //     const {user, isAuthenticated, logout} = useAuth();
// //
// //     if (!isAuthenticated) {
// //         return <Navigate to="/login"/>;
// //     }
// //
// //     return (
// //         <div>
// //             <h2>Мій профіль</h2>
// //             <p>Логін: {user?.email}</p>
// //             <p>Ім'я: {user?.profile.name}</p>
// //             <p>Роль: {user?.role}</p>
// //             <p>Тип акаунту: {user?.account_type}</p>
// //             <button onClick={logout}>Вийти</button>
// //         </div>
// //     );
// // };
// //
// // export {ProfilePage};
