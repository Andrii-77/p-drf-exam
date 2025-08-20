import React from "react";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Вітаємо на сайті продажу автомобілів!!!
        </h1>
        <p className="text-lg text-gray-600">
          Тут ви знайдете найкращі пропозиції 🚗💨
          Оберіть автомобіль своєї мрії вже сьогодні!
        </p>
      </div>
    </div>
  );
};

export {WelcomePage};
