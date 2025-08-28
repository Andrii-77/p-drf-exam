import React from "react";

const CarPosterComponent = ({ car, role }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <h2 className="text-lg font-bold text-gray-800 mb-2">{car.id}</h2>
      <p className="text-gray-700 mb-1">
        <span className="font-medium">Ціна:</span> {car.original_price} {car.original_currency}
      </p>
      {["seller", "manager", "admin"].includes(role) && (
        <p className="text-sm text-gray-500 mb-1">
          <span className="font-medium">Статус:</span> {car.status}
        </p>
      )}
      <p className="text-gray-600 line-clamp-3">{car.description}</p>
      <p className="text-xs text-gray-400 mt-2">
        <span className="font-medium">Дата створення:</span> {new Date(car.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export { CarPosterComponent };



// import React from "react";
//
// const CarPosterComponent = ({ car, role }) => {
//   return (
//     <div className="border rounded-xl shadow-md p-4 bg-white">
//       <h2 className="text-lg font-semibold mb-2">{car.id}</h2>
//       <p className="text-gray-600 mb-1">Ціна: {car.original_price} {car.original_currency}</p>
//       {["seller", "manager", "admin"].includes(role) && (
//         <p className="text-sm text-gray-500 mb-1">Статус: {car.status}</p>
//       )}
//       <p className="text-sm text-gray-700 line-clamp-3">{car.description}</p>
//       <p className="text-xs text-gray-400 mt-2">
//         Дата створення: {new Date(car.created_at).toLocaleDateString()}
//       </p>
//     </div>
//   );
// };
//
// export {CarPosterComponent};
