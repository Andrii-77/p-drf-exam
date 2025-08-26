import React from "react";

const AdminDashboardPage = () => {
  return (
    <div className="p-8 min-h-[80vh] bg-gray-800 text-gray-100">
      <h1 className="text-2xl font-bold mb-5">
        Admin Dashboard
      </h1>
      <p className="text-gray-300">
        Ця сторінка доступна лише адміністратору.
      </p>

      {/* TODO: тут можна додати управління користувачами, системні налаштування */}
    </div>
  );
};

export { AdminDashboardPage };



// const AdminDashboardPage = () => {
//   return (
//     <div
//       style={{
//         padding: "32px",
//         backgroundColor: "#f9fafb",
//         minHeight: "100vh",
//       }}
//     >
//       <h1
//         style={{
//           fontSize: "1.5rem", // ~ text-2xl
//           fontWeight: "bold",
//           marginBottom: "20px",
//           color: "#1f2937",
//         }}
//       >
//         Admin Dashboard
//       </h1>
//       <p
//         style={{
//           fontSize: "1rem",
//           color: "#4b5563",
//         }}
//       >
//         Ця сторінка доступна лише адміністратору.
//       </p>
//
//       {/* TODO: тут можна додати управління користувачами, системні налаштування */}
//     </div>
//   );
// };
//
// export { AdminDashboardPage };
//
//
// // import React from "react";
//
// // const AdminDashboardPage = () => {
// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
// //       <p>Ця сторінка доступна лише адміністратору.</p>
// //       {/* TODO: тут можна додати управління користувачами, системні налаштування */}
// //     </div>
// //   );
// // };
// //
// // export {AdminDashboardPage};
