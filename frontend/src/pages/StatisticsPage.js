import React from "react";

const StatisticsPage = () => {
  return (
    <div className="p-10 min-h-[80vh] bg-gray-800 text-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">
        📊 Статистика
      </h1>
      <p className="text-gray-300 text-center max-w-lg">
        Тут буде статистика оголошень, переглядів і середніх цін по регіонах.
        Дані надходитимуть із вашого застосунку <strong>statistics</strong>.
      </p>
    </div>
  );
};

export { StatisticsPage };