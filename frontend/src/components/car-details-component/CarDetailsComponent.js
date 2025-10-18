import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ додаємо useLocation
import { useAuth } from "../../context/AuthContext";

const CarDetailsComponent = ({ car }) => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ доступ до URL та стану навігації
  const { user } = useAuth();

  if (!car) return <p className="text-gray-300">Дані завантажуються...</p>;

  const {
    id,
    user: owner,
    brand,
    model,
    description,
    original_price,
    original_currency,
    price_usd,
    price_eur,
    price_uah,
    location: carLocation,
    status,
    stats_message,
    total_views,
    daily_views,
    weekly_views,
    monthly_views,
    region_average_price,
    country_average_price,
  } = car;

  // ✅ Перевірка, чи користувач може редагувати
  const canEdit =
    user && (user.id === owner?.id || ["manager", "admin"].includes(user.role));

  // ✅ Логіка кнопки "Повернутись"
  // Якщо користувач потрапив сюди після редагування — у стані є { fromEdit: true }
  // У такому разі ведемо на /my-cars
  const handleGoBack = () => {
    if (location.state?.fromEdit) {
      navigate("/my-cars");
    } else {
      navigate(-1); // стандартна поведінка
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-lg space-y-6">
      {/* Продавець */}
      <div>
        <h2 className="text-lg font-semibold text-gray-200">
          Продавець: {owner?.profile?.name}
        </h2>
        {owner?.profile?.phone_number && (
          <p className="mt-2 text-xl font-bold text-green-400">
            📞 {owner.profile.phone_number}
          </p>
        )}
      </div>

      {/* Brand + Model */}
      <h1 className="text-3xl font-extrabold text-gray-100">
        {brand?.brand} {model?.model}
      </h1>

      {/* Опис */}
      {description && (
        <p className="text-gray-300 italic leading-relaxed">{description}</p>
      )}

      {/* Ціни */}
      <div className="space-y-1 border-t border-gray-700 pt-4">
        {original_price && (
          <p>
            <span className="font-medium">Ціна продавця:</span>{" "}
            {original_price} {original_currency}
          </p>
        )}
        {price_usd && <p>≈ {price_usd} USD</p>}
        {price_eur && <p>≈ {price_eur} EUR</p>}
        {price_uah && <p>≈ {price_uah} UAH</p>}
      </div>

      {/* Локація */}
      {carLocation && (
        <p className="text-sm text-gray-400 border-t border-gray-700 pt-4">
          📍 Місцезнаходження: {carLocation}
        </p>
      )}

      {/* Статус */}
      <p
        className={`font-medium border-t border-gray-700 pt-4 ${
          status === "active"
            ? "text-green-400"
            : status === "draft"
            ? "text-yellow-400"
            : "text-red-400"
        }`}
      >
        Статус: {status}
      </p>

      {/* Статистика або повідомлення */}
      {stats_message ? (
        <p className="text-sm text-gray-400 border-t border-gray-700 pt-4">
          {stats_message}
        </p>
      ) : (
        <div className="space-y-4 border-t border-gray-700 pt-4">
          {/* Перегляди */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              📊 Перегляди
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              {total_views !== null && <p>Всього: {total_views}</p>}
              {daily_views !== null && <p>Сьогодні: {daily_views}</p>}
              {weekly_views !== null && <p>За тиждень: {weekly_views}</p>}
              {monthly_views !== null && <p>За місяць: {monthly_views}</p>}
            </div>
          </div>

          {/* Середні ціни */}
          {(region_average_price?.usd || country_average_price?.usd) && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                💰 Середні ціни
              </h3>
              <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
                {region_average_price?.usd && (
                  <p>В регіоні: {region_average_price.usd} USD</p>
                )}
                {country_average_price?.usd && (
                  <p>По країні: {country_average_price.usd} USD</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Кнопки управління */}
      <div className="pt-6 border-t border-gray-700 flex justify-between items-center">
        {/* ✅ Кнопка повернення */}
        <button
          onClick={handleGoBack}
          className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-5 py-2 rounded-lg transition"
        >
          ⬅ Повернутись
        </button>

        {/* ✅ Кнопка редагування — тільки для власника або менеджера/адміна */}
        {canEdit && (
          <button
            onClick={() =>
              navigate(`/cars/${id}/edit`, { state: { fromDetails: true } })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
          >
            ✏️ Редагувати
          </button>
        )}
      </div>
    </div>
  );
};

export { CarDetailsComponent };



// import React from "react";
// import { useNavigate } from "react-router-dom";
//
// const CarDetailsComponent = ({ car }) => {
//   const navigate = useNavigate();
//
//   if (!car) return <p className="text-gray-300">Дані завантажуються...</p>;
//
//   const {
//     user,
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
//   } = car;
//
//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-lg space-y-6">
//       {/* Продавець */}
//       <div>
//         <h2 className="text-lg font-semibold text-gray-200">
//           Продавець: {user?.profile?.name}
//         </h2>
//         {user?.profile?.phone_number && (
//           <p className="mt-2 text-xl font-bold text-green-400">
//             📞 {user.profile.phone_number}
//           </p>
//         )}
//       </div>
//
//       {/* Brand + Model */}
//       <h1 className="text-3xl font-extrabold text-gray-100">
//         {brand?.brand} {model?.model}
//       </h1>
//
//       {/* Опис */}
//       {description && (
//         <p className="text-gray-300 italic leading-relaxed">{description}</p>
//       )}
//
//       {/* Ціни */}
//       <div className="space-y-1 border-t border-gray-700 pt-4">
//         {original_price && (
//           <p>
//             <span className="font-medium">Ціна продавця:</span> {original_price}{" "}
//             {original_currency}
//           </p>
//         )}
//         {price_usd && <p>≈ {price_usd} USD</p>}
//         {price_eur && <p>≈ {price_eur} EUR</p>}
//         {price_uah && <p>≈ {price_uah} UAH</p>}
//       </div>
//
//       {/* Локація */}
//       {location && (
//         <p className="text-sm text-gray-400 border-t border-gray-700 pt-4">
//           📍 Місцезнаходження: {location}
//         </p>
//       )}
//
//       {/* Статус */}
//       <p
//         className={`font-medium border-t border-gray-700 pt-4 ${
//           status === "active"
//             ? "text-green-400"
//             : status === "draft"
//             ? "text-yellow-400"
//             : "text-red-400"
//         }`}
//       >
//         Статус: {status}
//       </p>
//
//       {/* Статистика або повідомлення */}
//       {stats_message ? (
//         <p className="text-sm text-gray-400 border-t border-gray-700 pt-4">
//           {stats_message}
//         </p>
//       ) : (
//         <div className="space-y-4 border-t border-gray-700 pt-4">
//           {/* Перегляди */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-400 mb-2">
//               📊 Перегляди
//             </h3>
//             <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
//               {total_views !== null && <p>Всього: {total_views}</p>}
//               {daily_views !== null && <p>Сьогодні: {daily_views}</p>}
//               {weekly_views !== null && <p>За тиждень: {weekly_views}</p>}
//               {monthly_views !== null && <p>За місяць: {monthly_views}</p>}
//             </div>
//           </div>
//
//           {/* Середні ціни */}
//           {(region_average_price?.usd || country_average_price?.usd) && (
//             <div className="border-t border-gray-700 pt-4">
//               <h3 className="text-sm font-semibold text-gray-400 mb-2">
//                 💰 Середні ціни
//               </h3>
//               <div className="grid grid-cols-1 gap-1 text-sm text-gray-300">
//                 {region_average_price?.usd && (
//                   <p>В регіоні: {region_average_price.usd} USD</p>
//                 )}
//                 {country_average_price?.usd && (
//                   <p>По країні: {country_average_price.usd} USD</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//
//       {/* Кнопка повернення */}
//       <div className="pt-6 border-t border-gray-700">
//         <button
//           onClick={() => navigate(-1)}
//           className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-5 py-2 rounded-lg transition"
//         >
//           ⬅ Повернутись на попередню сторінку
//         </button>
//       </div>
//     </div>
//   );
// };
//
// export { CarDetailsComponent };




// import React from "react";
//
// const CarDetailsComponent = ({ car }) => {
//     if (!car) return <p>Дані завантажуються...</p>;
//
//     const {
//         user,
//         brand,
//         model,
//         description,
//         original_price,
//         original_currency,
//         price_usd,
//         price_eur,
//         price_uah,
//         location,
//         status,
//         stats_message,
//         total_views,
//         daily_views,
//         weekly_views,
//         monthly_views,
//         region_average_price,
//         country_average_price,
//     } = car;
//
//     return (
//         <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
//             {/* Продавець */}
//             <h2 className="text-lg font-semibold text-gray-700">
//                 Продавець:{" "}
//                 {user?.profile?.name}
//                 {user?.profile?.phone_number && (
//                     <span className="ml-2 text-sm text-gray-500">
//                         (тел: {user.profile.phone_number})
//                     </span>
//                 )}
//             </h2>
//
//             {/* Brand + Model */}
//             <h1 className="text-2xl font-bold text-gray-900">
//                 {brand?.brand} {model?.model}
//             </h1>
//
//             {/* Опис */}
//             {description && <p className="text-gray-700 italic">{description}</p>}
//
//             {/* Ціни */}
//             <div className="space-y-1">
//                 {original_price && (
//                     <p>
//                         Ціна продавця: {original_price} {original_currency}
//                     </p>
//                 )}
//                 {price_usd && <p>Ціна в USD: {price_usd}</p>}
//                 {price_eur && <p>Ціна в EUR: {price_eur}</p>}
//                 {price_uah && <p>Ціна в UAH: {price_uah}</p>}
//             </div>
//
//             {/* Локація */}
//             {location && (
//                 <p className="text-sm text-gray-600">Місцезнаходження: {location}</p>
//             )}
//
//             {/* Статус */}
//             <p
//                 className={`font-medium ${
//                     status === "active"
//                         ? "text-green-600"
//                         : status === "draft"
//                         ? "text-yellow-600"
//                         : "text-red-600"
//                 }`}
//             >
//                 Статус: {status}
//             </p>
//
//             {/* Статистика або повідомлення */}
//             {stats_message ? (
//                 <p className="text-sm text-gray-500">{stats_message}</p>
//             ) : (
//                 <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
//                     {total_views !== null && <p>Всього переглядів: {total_views}</p>}
//                     {daily_views !== null && <p>Перегляди сьогодні: {daily_views}</p>}
//                     {weekly_views !== null && <p>За тиждень: {weekly_views}</p>}
//                     {monthly_views !== null && <p>За місяць: {monthly_views}</p>}
//                     {region_average_price && region_average_price.usd && (
//                         <p>Середня ціна в регіоні: {region_average_price.usd} USD</p>
//                     )}
//                     {country_average_price && country_average_price.usd && (
//                         <p>Середня ціна по країні: {country_average_price.usd} USD</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export { CarDetailsComponent };
//
//
//
//
// // import React from "react";
// //
// // const CarDetailsComponent = ({car}) => {
// //     if (!car) return <p>Дані завантажуються...</p>;
// //
// //     const {
// //         user,
// //         brand,
// //         model,
// //         description,
// //         original_price,
// //         original_currency,
// //         price_usd,
// //         price_eur,
// //         price_uah,
// //         location,
// //         status,
// //         stats_message,
// //         total_views,
// //         daily_views,
// //         weekly_views,
// //         monthly_views,
// //         region_average_price,
// //         country_average_price,
// //     } = car;
// //
// //     return (
// //         <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
// //             {/* Продавець */}
// //             <h2 className="text-lg font-semibold text-gray-700">
// //                 Продавець: {user}
// //             </h2>
// //
// //
// //             {/* Brand + Model */}
// //             <h1 className="text-2xl font-bold text-gray-900">
// //                 {brand?.brand} {model?.model}
// //             </h1>
// //
// //             {/* Опис */}
// //             {description && <p className="text-gray-700 italic">{description}</p>}
// //
// //             {/* Ціни */}
// //             <div className="space-y-1">
// //                 {original_price && (
// //                     <p>
// //                         Ціна: {original_price} {original_currency}
// //                     </p>
// //                 )}
// //                 {price_usd && <p>≈ {price_usd} USD</p>}
// //                 {price_eur && <p>≈ {price_eur} EUR</p>}
// //                 {price_uah && <p>≈ {price_uah} UAH</p>}
// //             </div>
// //
// //             {/* Локація */}
// //             {location && (
// //                 <p className="text-sm text-gray-600">Місцезнаходження: {location}</p>
// //             )}
// //
// //             {/* Статус */}
// //             <p
// //                 className={`font-medium ${
// //                     status === "active"
// //                         ? "text-green-600"
// //                         : status === "draft"
// //                             ? "text-yellow-600"
// //                             : "text-red-600"
// //                 }`}
// //             >
// //                 Статус: {status}
// //             </p>
// //
// //             {/* Статистика або повідомлення */}
// //             {stats_message ? (
// //                 <p className="text-sm text-gray-500">{stats_message}</p>
// //             ) : (
// //                 <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
// //                     {total_views !== null && <p>Всього переглядів: {total_views}</p>}
// //                     {daily_views !== null && <p>Перегляди сьогодні: {daily_views}</p>}
// //                     {weekly_views !== null && <p>За тиждень: {weekly_views}</p>}
// //                     {monthly_views !== null && <p>За місяць: {monthly_views}</p>}
// //                     {region_average_price && region_average_price.usd && (
// //                         <p>Середня ціна в регіоні: {region_average_price.usd} USD</p>
// //                     )}
// //                     {country_average_price && country_average_price.usd && (
// //                         <p>Середня ціна по країні: {country_average_price.usd} USD</p>
// //                     )}
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };
// //
// // export {CarDetailsComponent};
//
//
// // import React from "react";
// //
// // const CarDetailsComponent = ({ car }) => {
// //   if (!car) return <p>Дані завантажуються...</p>;
// //
// //   const {
// //     username,
// //     brand,
// //     model,
// //     description,
// //     original_price,
// //     original_currency,
// //     price_usd,
// //     price_eur,
// //     price_uah,
// //     location,
// //     status,
// //     stats_message,
// //     total_views,
// //     daily_views,
// //     weekly_views,
// //     monthly_views,
// //     region_average_price,
// //     country_average_price,
// //     updated_at,
// //     created_at,
// //   } = car;
// //
// //   return (
// //     <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
// //       {/* Продавець */}
// //       {username && (
// //         <h2 className="text-lg font-semibold text-gray-700">
// //           Продавець: {username}
// //         </h2>
// //       )}
// //
// //       {/* Brand + Model */}
// //       <h1 className="text-2xl font-bold text-gray-900">
// //         {brand?.brand} {model?.model}
// //       </h1>
// //
// //       {/* Опис */}
// //       {description && <p className="text-gray-700 italic">{description}</p>}
// //
// //       {/* Ціни */}
// //       <div className="space-y-1">
// //         {original_price && (
// //           <p>
// //             Ціна: {original_price} {original_currency}
// //           </p>
// //         )}
// //         {price_usd && <p>≈ {price_usd} USD</p>}
// //         {price_eur && <p>≈ {price_eur} EUR</p>}
// //         {price_uah && <p>≈ {price_uah} UAH</p>}
// //       </div>
// //
// //       {/* Локація */}
// //       {location && (
// //         <p className="text-sm text-gray-600">Місцезнаходження: {location}</p>
// //       )}
// //
// //       {/* Статус */}
// //       <p
// //         className={`font-medium ${
// //           status === "active"
// //             ? "text-green-600"
// //             : status === "draft"
// //             ? "text-yellow-600"
// //             : "text-red-600"
// //         }`}
// //       >
// //         Статус: {status}
// //       </p>
// //
// //       {/* Статистика або повідомлення */}
// //       {stats_message ? (
// //         <p className="text-sm text-gray-500">{stats_message}</p>
// //       ) : (
// //         <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
// //           {total_views !== null && <p>Всього переглядів: {total_views}</p>}
// //           {daily_views !== null && <p>Перегляди сьогодні: {daily_views}</p>}
// //           {weekly_views !== null && <p>За тиждень: {weekly_views}</p>}
// //           {monthly_views !== null && <p>За місяць: {monthly_views}</p>}
// //           {region_average_price && region_average_price.usd && (
// //             <p>Середня ціна в регіоні: {region_average_price.usd} USD</p>
// //           )}
// //           {country_average_price && country_average_price.usd && (
// //             <p>Середня ціна по країні: {country_average_price.usd} USD</p>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };
// //
// // export { CarDetailsComponent };
