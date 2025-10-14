import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRouteComponent = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();

  // Якщо користувач не авторизований → редірект на головну
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Якщо роль не підходить → редірект на головну
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(user?.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export { ProtectedRouteComponent };



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