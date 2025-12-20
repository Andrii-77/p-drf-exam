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