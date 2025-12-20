import React from "react";
import { useNavigate } from "react-router-dom";

const ModerationPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen p-6 flex flex-col items-center bg-gray-800 text-gray-100">
            <h1 className="text-3xl font-bold mb-10 text-center">
                Центр модерації
            </h1>

            <div className="flex flex-col items-center gap-6">

                {/* Кнопка в стилі ManagerDashboardPage */}
                <button
                    onClick={() => navigate("/moderation/support-requests")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition text-lg"
                >
                    📩 Запити про відсутні бренди/моделі
                </button>

            </div>
        </div>
    );
};

export { ModerationPage };