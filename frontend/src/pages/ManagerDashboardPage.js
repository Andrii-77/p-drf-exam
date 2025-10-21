import React from "react";
import { UsersComponent } from "../components/users-component/UsersComponent";

const ManagerDashboardPage = ({ user }) => {
  return (
    <div className="p-8 min-h-[80vh] bg-gray-800 text-gray-100">
      <h1 className="text-2xl font-bold mb-5">Manager Dashboard</h1>
      <UsersComponent user={user} />
    </div>
  );
};

export { ManagerDashboardPage };



// import React from "react";
//
// const ManagerDashboardPage = () => {
//   return (
//     <div className="p-8 min-h-[80vh] bg-gray-800 text-gray-100">
//       <h1 className="text-2xl font-bold mb-5">
//         Manager Dashboard
//       </h1>
//       <p className="text-gray-300">
//         Ця сторінка доступна лише менеджеру.
//       </p>
//
//       {/* TODO: тут можна додати модерацію оголошень, статистику тощо */}
//     </div>
//   );
// };
//
// export { ManagerDashboardPage };



// const ManagerDashboardPage = () => {
//   return (
//     <div
//       style={{
//         padding: "32px",
//         backgroundColor: "#f9fafb", // світлий фон для приємності
//         minHeight: "100vh",
//       }}
//     >
//       <h1
//         style={{
//           fontSize: "1.5rem", // ~ text-2xl
//           fontWeight: "bold",
//           marginBottom: "20px",
//           color: "#1f2937", // темний відтінок
//         }}
//       >
//         Manager Dashboard
//       </h1>
//       <p
//         style={{
//           fontSize: "1rem",
//           color: "#4b5563", // сірий для тексту
//         }}
//       >
//         Ця сторінка доступна лише менеджеру.
//       </p>
//
//       {/* TODO: тут можна додати модерацію оголошень, статистику тощо */}
//     </div>
//   );
// };
//
// export { ManagerDashboardPage };
//
//
// // import React from "react";
//
// // const ManagerDashboardPage = () => {
// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
// //       <p>Ця сторінка доступна лише менеджеру.</p>
// //       {/* TODO: тут можна додати модерацію оголошень, статистику тощо */}
// //     </div>
// //   );
// // };
// //
// // export {ManagerDashboardPage};
