import React from "react";
import { Link } from "react-router-dom";

const UserComponent = ({ user }) => {
  return (
    <div className="bg-gray-700 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow duration-200">
      <h2 className="text-lg font-bold text-gray-100 mb-2">
        ID користувача: {user.id}
      </h2>

      <p className="text-gray-200 mb-1">
        <span className="font-medium">Email:</span> {user.email}
      </p>

      {user.profile && (
        <>
          <p className="text-gray-200 mb-1">
            <span className="font-medium">Ім’я:</span> {user.profile.name}
          </p>
          <p className="text-gray-200 mb-1">
            <span className="font-medium">Прізвище:</span> {user.profile.surname}
          </p>
          <p className="text-gray-200 mb-1">
            <span className="font-medium">Телефон:</span> {user.profile.phone_number}
          </p>
        </>
      )}

      <p className="text-gray-300 mb-1">
        <span className="font-medium">Роль:</span> {user.role}
      </p>

      {user.account_type && (
        <p className="text-gray-300 mb-1">
          <span className="font-medium">Тип акаунту:</span> {user.account_type}
        </p>
      )}

      <p className="text-sm text-gray-400 mb-1">
        <span className="font-medium">Активний:</span>{" "}
        {user.is_active ? "✅ Так" : "❌ Ні"}
      </p>

      <p className="text-xs text-gray-400 mt-2">
        <span className="font-medium">Дата створення:</span>{" "}
        {new Date(user.created_at).toLocaleDateString()}
      </p>

      {/* 🔹 Кнопка "Детальніше" */}
      <Link
        to={`/users/${user.id}`}
        className="inline-block mt-4 bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Детальніше
      </Link>
    </div>
  );
};

export { UserComponent };