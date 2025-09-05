import React from "react";

const CarDetailsComponent = ({ car }) => {
  if (!car) return <p>Дані завантажуються...</p>;

  const {
    username,
    brand,
    model,
    description,
    original_price,
    original_currency,
    price_usd,
    price_eur,
    price_uah,
    location,
    status,
    stats_message,
    total_views,
    daily_views,
    weekly_views,
    monthly_views,
    region_average_price,
    country_average_price,
  } = car;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
      {/* Продавець */}
      {username && (
        <h2 className="text-lg font-semibold text-gray-700">
          Продавець: {username}
        </h2>
      )}

      {/* Brand + Model */}
      <h1 className="text-2xl font-bold text-gray-900">
        {brand?.brand} {model?.model}
      </h1>

      {/* Опис */}
      {description && <p className="text-gray-700 italic">{description}</p>}

      {/* Ціни */}
      <div className="space-y-1">
        {original_price && (
          <p>
            Ціна: {original_price} {original_currency}
          </p>
        )}
        {price_usd && <p>≈ {price_usd} USD</p>}
        {price_eur && <p>≈ {price_eur} EUR</p>}
        {price_uah && <p>≈ {price_uah} UAH</p>}
      </div>

      {/* Локація */}
      {location && (
        <p className="text-sm text-gray-600">Місцезнаходження: {location}</p>
      )}

      {/* Статус */}
      <p
        className={`font-medium ${
          status === "active"
            ? "text-green-600"
            : status === "draft"
            ? "text-yellow-600"
            : "text-red-600"
        }`}
      >
        Статус: {status}
      </p>

      {/* Статистика або повідомлення */}
      {stats_message ? (
        <p className="text-sm text-gray-500">{stats_message}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          {total_views !== null && <p>Всього переглядів: {total_views}</p>}
          {daily_views !== null && <p>Перегляди сьогодні: {daily_views}</p>}
          {weekly_views !== null && <p>За тиждень: {weekly_views}</p>}
          {monthly_views !== null && <p>За місяць: {monthly_views}</p>}
          {region_average_price && region_average_price.usd && (
            <p>Середня ціна в регіоні: {region_average_price.usd} USD</p>
          )}
          {country_average_price && country_average_price.usd && (
            <p>Середня ціна по країні: {country_average_price.usd} USD</p>
          )}
        </div>
      )}
    </div>
  );
};

export { CarDetailsComponent };



// import React from "react";
//
// const CarDetailsComponent = ({ car }) => {
//   if (!car) return <p>Дані завантажуються...</p>;
//
//   const {
//     username,
//     brand,
//     model,
//     description,
//     original_price,
//     original_currency,
//     price_usd,
//     price_eur,
//     price_uah,
//     location,
//     status,
//     stats_message,
//     total_views,
//     daily_views,
//     weekly_views,
//     monthly_views,
//     region_average_price,
//     country_average_price,
//     updated_at,
//     created_at,
//   } = car;
//
//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
//       {/* Продавець */}
//       {username && (
//         <h2 className="text-lg font-semibold text-gray-700">
//           Продавець: {username}
//         </h2>
//       )}
//
//       {/* Brand + Model */}
//       <h1 className="text-2xl font-bold text-gray-900">
//         {brand?.brand} {model?.model}
//       </h1>
//
//       {/* Опис */}
//       {description && <p className="text-gray-700 italic">{description}</p>}
//
//       {/* Ціни */}
//       <div className="space-y-1">
//         {original_price && (
//           <p>
//             Ціна: {original_price} {original_currency}
//           </p>
//         )}
//         {price_usd && <p>≈ {price_usd} USD</p>}
//         {price_eur && <p>≈ {price_eur} EUR</p>}
//         {price_uah && <p>≈ {price_uah} UAH</p>}
//       </div>
//
//       {/* Локація */}
//       {location && (
//         <p className="text-sm text-gray-600">Місцезнаходження: {location}</p>
//       )}
//
//       {/* Статус */}
//       <p
//         className={`font-medium ${
//           status === "active"
//             ? "text-green-600"
//             : status === "draft"
//             ? "text-yellow-600"
//             : "text-red-600"
//         }`}
//       >
//         Статус: {status}
//       </p>
//
//       {/* Статистика або повідомлення */}
//       {stats_message ? (
//         <p className="text-sm text-gray-500">{stats_message}</p>
//       ) : (
//         <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
//           {total_views !== null && <p>Всього переглядів: {total_views}</p>}
//           {daily_views !== null && <p>Перегляди сьогодні: {daily_views}</p>}
//           {weekly_views !== null && <p>За тиждень: {weekly_views}</p>}
//           {monthly_views !== null && <p>За місяць: {monthly_views}</p>}
//           {region_average_price && region_average_price.usd && (
//             <p>Середня ціна в регіоні: {region_average_price.usd} USD</p>
//           )}
//           {country_average_price && country_average_price.usd && (
//             <p>Середня ціна по країні: {country_average_price.usd} USD</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
//
// export { CarDetailsComponent };
