import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="p-6 min-h-[80vh] bg-gray-800 text-gray-100 flex justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-center">Редагувати користувача #{id}</h1>

        <p className="text-gray-300">
          Це тимчасова сторінка редагування. Тут ти можеш реалізувати форму зміни профілю/ролі/статусу користувача.
        </p>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded"
          >
            Повернутись
          </button>

          <button
            onClick={() => {
              // тимчасова поведінка — після "збереження" повертаємось на сторінку деталей
              navigate(`/users/${id}`);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Зберегти (симуляція)
          </button>
        </div>
      </div>
    </div>
  );
};

export { EditUserPage };