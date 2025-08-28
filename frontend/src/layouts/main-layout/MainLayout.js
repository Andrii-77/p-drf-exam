import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "../../components/menu/MenuComponent";

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
// const main-layout = () => {
//     return (
//         <div>
//             <div>main-layout</div>
//             <Outlet/>
//         </div>
//     );
// };
//
// export {main-layout};

// import React from "react";
// import {Outlet} from "react-router-dom";
// import {menu} from "../../components/menu/MenuComponent";
//
// const main-layout = () => {
//     return (
//         <div style={{minHeight: "100vh", display: "flex", flexDirection: "column"}}>
//             <menu/>
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
// export {main-layout}