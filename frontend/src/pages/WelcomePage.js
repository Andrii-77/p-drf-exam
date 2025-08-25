import React from "react";

const WelcomePage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        background: "linear-gradient(to right, #bfdbfe, #93c5fd)", // від blue-100 до blue-300
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "672px", // ~ max-w-2xl
        }}
      >
        <h1
          style={{
            fontSize: "2.25rem", // ~ text-4xl
            fontWeight: "bold",
            color: "#1f2937", // gray-800
            marginBottom: "24px",
          }}
        >
          Вітаємо на сайті продажу автомобілів!!!
        </h1>
        <p
          style={{
            fontSize: "1.125rem", // ~ text-lg
            color: "#4b5563", // gray-600
          }}
        >
          Тут ви знайдете найкращі пропозиції 🚗💨
          Оберіть автомобіль своєї мрії вже сьогодні!
        </p>
      </div>
    </div>
  );
};

export { WelcomePage };


// import React from "react";
//
// const WelcomePage = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
//       <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-2xl">
//         <h1 className="text-4xl font-bold text-gray-800 mb-6">
//           Вітаємо на сайті продажу автомобілів!!!
//         </h1>
//         <p className="text-lg text-gray-600">
//           Тут ви знайдете найкращі пропозиції 🚗💨
//           Оберіть автомобіль своєї мрії вже сьогодні!
//         </p>
//       </div>
//     </div>
//   );
// };
//
// export {WelcomePage};
