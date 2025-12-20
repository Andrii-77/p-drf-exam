import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[100vh] bg-gray-800 p-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-100 mb-4">
          404 — Сторінку не знайдено
        </h1>
        <p className="text-gray-300 mb-6">
          На жаль, сторінка, яку ви шукаєте, не існує.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
        >
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
};

export { NotFoundPage };