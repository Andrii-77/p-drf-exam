import React from "react";

const ModerationPage = () => {
  return (
    <div className="p-10 min-h-[80vh] bg-gray-800 text-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">
        🛠️ Модерація оголошень
      </h1>
      <p className="text-gray-300 text-center max-w-lg">
        Тут з’явиться список авто, які очікують перевірки менеджером або адміністратором.
        Ви зможете переглядати, схвалювати або відхиляти публікації.
      </p>
    </div>
  );
};

export { ModerationPage };