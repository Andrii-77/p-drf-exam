import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await userService.getAll(); // або зробіть userService.getById(id), якщо реалізуєте
        const foundUser = data.data.find((u) => u.id === Number(id)); // тимчасове рішення, поки нема getById
        setUser(foundUser);
      } catch (err) {
        setError("Не вдалося завантажити дані користувача.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-800">
        <p className="text-gray-300">Завантаження даних користувача...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-800">
        <p className="text-red-400">
          {error || "Користувача не знайдено."}
        </p>
      </div>
    );
  }

  const {
    email,
    role,
    account_type,
    is_active,
    created_at,
    updated_at,
    profile,
  } = user;

  return (
    <div className="p-6 min-h-[80vh] bg-gray-800 text-gray-100 flex justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-2xl space-y-6">
        {/* Назва сторінки */}
        <h1 className="text-2xl font-bold text-center border-b border-gray-700 pb-3">
          Деталі користувача
        </h1>

        {/* Основна інформація */}
        <div className="space-y-2 text-gray-300">
          <p>
            <strong className="text-gray-100">Email:</strong> {email}
          </p>
          <p>
            <strong className="text-gray-100">Роль:</strong> {role}
          </p>
          {account_type && (
            <p>
              <strong className="text-gray-100">Тип акаунту:</strong> {account_type}
            </p>
          )}
          <p>
            <strong className="text-gray-100">Статус:</strong>{" "}
            {is_active ? (
              <span className="text-green-400">Активний</span>
            ) : (
              <span className="text-red-400">Неактивний</span>
            )}
          </p>
          <p>
            <strong className="text-gray-100">Створено:</strong>{" "}
            {new Date(created_at).toLocaleString()}
          </p>
          <p>
            <strong className="text-gray-100">Оновлено:</strong>{" "}
            {new Date(updated_at).toLocaleString()}
          </p>
        </div>

        {/* Профіль */}
        {profile && (
          <div className="pt-4 border-t border-gray-700">
            <h2 className="text-lg font-semibold mb-2">Профіль</h2>
            <div className="space-y-1 text-gray-300">
              <p>
                <strong className="text-gray-100">Ім’я:</strong> {profile.name}
              </p>
              <p>
                <strong className="text-gray-100">Прізвище:</strong> {profile.surname}
              </p>
              <p>
                <strong className="text-gray-100">Телефон:</strong> {profile.phone_number}
              </p>
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className="pt-6 border-t border-gray-700 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-5 py-2 rounded-lg transition"
          >
            ⬅ Повернутись
          </button>

          <button
            onClick={() => navigate(`/users/${id}/edit`, { state: { fromDetails: true } })}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
          >
            ✏️ Редагувати
          </button>
        </div>
      </div>
    </div>
  );
};

export { UserDetailsPage };