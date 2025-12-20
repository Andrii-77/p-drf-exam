import React from "react";
import {useNavigate} from "react-router-dom";

const ManagerDashboardPage = ({user}) => {
    const navigate = useNavigate();

    return (
        <div className="p-10 min-h-[80vh] bg-gray-800 text-gray-100 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Панель менеджера
            </h1>

            <p className="text-gray-400 mb-10 text-center max-w-xl">
                Вітаємо,{" "}
                <span className="text-blue-400 font-semibold">{user?.email}</span>!
                Ви можете переглядати користувачів, авто та модерацію оголошень.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center">
                {/* Користувачі */}
                <button
                    onClick={() => navigate("/users")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition text-lg"
                >
                    👥 Користувачі
                </button>

                {/* Авто */}
                <button
                    onClick={() => navigate("/cars")}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition text-lg"
                >
                    🚗 Усі авто
                </button>

                {/* Модерація */}
                <button
                    onClick={() => navigate("/moderation")}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition text-lg"
                >
                    🛠️ Модерація
                </button>

                {/* 🔹 Додати бренд / модель */}
                <button
                    onClick={() => navigate("/create-brand-model")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition text-lg"
                >
                    🏷️ Додати бренд / модель
                </button>

                {/* Усі бренди */}
                <button
                    onClick={() => navigate("/brands")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition text-lg"
                >
                    📚 Усі бренди
                </button>

                {/* Усі моделі */}
                <button
                    onClick={() => navigate("/models")}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition text-lg"
                >
                    🧩 Усі моделі
                </button>
            </div>
        </div>
    );
};

export {ManagerDashboardPage};