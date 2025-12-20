import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const displayName =
    user?.profile?.name || (user?.role === "admin" ? "Адміністоре" : "Користувачу");

  const handleViewDetails = () => {
    if (user?.id) {
      navigate(`/users/${user.id}`);
    }
  };

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

        <div className="flex justify-center">
          <button
            onClick={handleViewDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Переглянути деталі профілю
          </button>
        </div>
      </div>
    </div>
  );
};

export { ProfilePage };