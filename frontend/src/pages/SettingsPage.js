import React from "react";

const SettingsPage = () => {
  return (
    <div className="p-10 min-h-[80vh] bg-gray-800 text-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-300">
        ⚙️ Налаштування системи
      </h1>
      <p className="text-gray-300 text-center max-w-lg">
        Тут можна буде змінювати глобальні параметри системи, права доступу або параметри
        модерації. Сторінка поки в розробці.
      </p>
    </div>
  );
};

export { SettingsPage };