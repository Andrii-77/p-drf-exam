import React from "react";
import { useAuth } from "../context/AuthContext";
import { CarPostersComponent } from "../components/car-posters-component/CarPostersComponent";

const CarPostersPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <CarPostersComponent user={user} />
    </div>
  );
};

export { CarPostersPage };



// import React from "react";
// import { useAuth } from "../context/AuthContext";
// import { CarPostersComponent } from "../components/car-posters-component/CarPostersComponent";
//
// const CarPostersPage = () => {
//   const { user } = useAuth();
//
//   return (
//     <div className="container mx-auto py-6">
//       <CarPostersComponent user={user} />
//     </div>
//   );
// };
//
// export { CarPostersPage };



// import React, { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import {CarPostersComponent} from "../components/car-posters-component/CarPostersComponent";
// // 👆 приклад — у вас може бути інший спосіб зберігання користувача
//
// const CarPostersPage = () => {
//   // Тут ми беремо інформацію про користувача (role, id, name, ...)
//   const { user } = useContext(AuthContext);
//
//   return (
//     <div className="container mx-auto py-6">
//       <CarPostersComponent user={user} />
//     </div>
//   );
// };
//
// export {CarPostersPage};
