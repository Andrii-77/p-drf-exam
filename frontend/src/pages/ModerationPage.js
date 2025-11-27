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
                    📩 Support Requests
                </button>

            </div>
        </div>
    );
};

export { ModerationPage };


// import React from "react";
//
// const ModerationPage = () => {
//   return (
//     <div className="p-10 min-h-[80vh] bg-gray-800 text-gray-100 flex flex-col items-center justify-center">
//       <h1 className="text-3xl font-bold mb-6 text-orange-400">
//         🛠️ Модерація оголошень
//       </h1>
//       <p className="text-gray-300 text-center max-w-lg">
//         Тут з’явиться список авто, які очікують перевірки менеджером або адміністратором.
//         Ви зможете переглядати, схвалювати або відхиляти публікації.
//       </p>
//     </div>
//   );
// };
//
// export { ModerationPage };