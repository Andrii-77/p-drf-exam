import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "../../components/menu/MenuComponent";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-gray-100">
      {/* Фіксоване меню зверху */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Menu />
      </div>

      {/* Основний контент з відступом під висоту меню */}
      <main className="flex-1 max-w-[1200px] mx-auto p-4 w-full pt-20">
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