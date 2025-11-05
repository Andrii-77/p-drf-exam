import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRouteComponent = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // 🕒 Поки дані користувача завантажуються — показуємо лоадер
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-200 text-lg">
        Завантаження...
      </div>
    );
  }

  // ❌ Якщо користувач не авторизований — редірект на головну
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Якщо вказано роль — перевіряємо, чи дозволена
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(user?.role)) {
      return <Navigate to="/" replace />;
    }
  }

  // ✅ Якщо все добре — показуємо контент
  return children;
};

export { ProtectedRouteComponent };




// // 20251105 Роблю зміни, щоб можна було робити переходи по урлі і встигали підтягнутись дані користувача.
// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
//
// const ProtectedRouteComponent = ({ children, role }) => {
//   const { isAuthenticated, user } = useAuth();
//
//   // Якщо користувач не авторизований → редірект на головну
//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }
//
//   // Якщо роль не підходить → редірект на головну
//   if (role) {
//     const allowedRoles = Array.isArray(role) ? role : [role];
//     if (!allowedRoles.includes(user?.role)) {
//       return <Navigate to="/" replace />;
//     }
//   }
//
//   return children;
// };
//
// export { ProtectedRouteComponent };



// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
//
// const ProtectedRouteComponent = ({ children, role }) => {
//   const { isAuthenticated, user } = useAuth();
//
//   // Якщо користувач не авторизований → редірект на домашню сторінку (WelcomePage)
//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }
//
//   // Якщо роль не підходить → редірект на домашню сторінку
//   if (role && user?.role !== role) {
//     return <Navigate to="/" replace />;
//   }
//
//   return children;
// };
//
// export { ProtectedRouteComponent };



// import React from "react";
// import {Navigate, useLocation} from "react-router-dom";
// import {useAuth} from "../../context/AuthContext";
//
//
// const ProtectedRouteComponent = ({children, role}) => {
//     const {isAuthenticated, user} = useAuth();
//     const location = useLocation();
//
//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace state={{from: location}}/>;
//     }
//
//     if (role && user?.role !== role) {
//         return <Navigate to="/" replace/>;
//     }
//
//     return children;
// }
//
// export {ProtectedRouteComponent}