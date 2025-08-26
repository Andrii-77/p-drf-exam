import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "../../components/Menu/MenuComponent";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-gray-100">
      {/* Меню зверху */}
      <Menu />

      {/* Основний контент */}
      <main className="flex-1 max-w-[1200px] mx-auto p-4 w-full">
        <Outlet />
      </main>

      {/* Підвал */}
      <footer className="border-t border-gray-700 p-3 text-center text-gray-400">
        AutoRia Clone • стартова версія
      </footer>
    </div>
  );
};

export { MainLayout };



// import { Outlet } from "react-router-dom";
//
// const MainLayout = () => {
//     return (
//         <div>
//             <div>MainLayout</div>
//             <Outlet/>
//         </div>
//     );
// };
//
// export {MainLayout};

// import React from "react";
// import {Outlet} from "react-router-dom";
// import {Menu} from "../../components/Menu/MenuComponent";
//
// const MainLayout = () => {
//     return (
//         <div style={{minHeight: "100vh", display: "flex", flexDirection: "column"}}>
//             <Menu/>
//             <main style={{flex: 1, maxWidth: 1200, margin: "0 auto", padding: "16px"}}>
//                 <Outlet/>
//             </main>
//             <footer style={{borderTop: "1px solid #eee", padding: "12px 16px", textAlign: "center"}}>
//                 AutoRia Clone • стартова версія
//             </footer>
//         </div>
//     );
// }
//
// export {MainLayout}