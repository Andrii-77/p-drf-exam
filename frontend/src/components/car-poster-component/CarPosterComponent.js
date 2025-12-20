import React from "react";
import { Link } from "react-router-dom";

const CarPosterComponent = ({ car, role }) => {
  return (
    <div className="bg-gray-700 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow duration-200">
      <h2 className="text-lg font-bold text-gray-100 mb-2">{car.id}</h2>

      <p className="text-gray-200 mb-1">
        <span className="font-medium">Авто:</span>{" "}
        {typeof car.brand === "object" ? car.brand?.brand : car.brand}{" "}
        {typeof car.model === "object" ? car.model?.model : car.model}
      </p>

      {/* Замінили original_price на price_usd */}
      <p className="text-gray-300 mb-1">
        <span className="font-medium">Ціна:</span> {car.price_usd} USD
      </p>

      {["seller", "manager", "admin"].includes(role) && (
        <p className="text-sm text-gray-400 mb-1">
          <span className="font-medium">Статус:</span> {car.status}
        </p>
      )}

      <p className="text-gray-300 line-clamp-3">{car.description}</p>

      <p className="text-xs text-gray-400 mt-2">
        <span className="font-medium">Дата створення:</span>{" "}
        {new Date(car.created_at).toLocaleDateString()}
      </p>

      <Link
        to={`/cars/${car.id}`}
        className="inline-block mt-4 bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Детальніше про авто
      </Link>
    </div>
  );
};

export { CarPosterComponent };