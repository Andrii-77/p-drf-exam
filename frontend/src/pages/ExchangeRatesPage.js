import React from "react";

const ExchangeRatesPage = () => {
  return (
    <div className="p-10 min-h-[80vh] bg-gray-800 text-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">
        💱 Курси валют
      </h1>
      <p className="text-gray-300 text-center max-w-lg">
        Тут можуть бути актуальні курси валют, отримані з ПриватБанку.
        Адміністратор зможе оновлювати або переглядати історію курсів.
      </p>
    </div>
  );
};

export { ExchangeRatesPage };