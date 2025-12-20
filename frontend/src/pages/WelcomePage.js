import React from "react";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-800">
      <div className="bg-gray-900 p-10 rounded-xl shadow-lg text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-100 mb-6">
          Вітаємо на сайті продажу автомобілів!!!
        </h1>
        <p className="text-lg text-gray-300">
          Тут ви знайдете найкращі пропозиції 🚗💨
          Оберіть автомобіль своєї мрії вже сьогодні!
        </p>
      </div>
    </div>
  );
};

export { WelcomePage };