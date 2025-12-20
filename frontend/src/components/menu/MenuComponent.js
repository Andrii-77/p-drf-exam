import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Конфігурація меню для різних ролей
const menuConfig = {
  guest: [
    { label: "Домашня сторінка", path: "/" },
    { label: "Всі авто", path: "/cars" },
    { label: "Логін", path: "/login" },
    { label: "Реєстрація", path: "/register" },
  ],
  buyer: [
    { label: "Профіль", path: "/profile" },
    { label: "Всі авто", path: "/cars" },
    { label: "Вийти", action: "logout" },
  ],
  seller: [
    { label: "Профіль", path: "/profile" },
    { label: "Всі авто", path: "/cars" },
    { label: "Створити оголошення", path: "/create-car" },
    { label: "Мої авто", path: "/my-cars" },
    { label: "Вийти", action: "logout" },
  ],
  manager: [
    { label: "Профіль", path: "/profile" },
    { label: "Дашборд менеджера", path: "/manager" },
    { label: "Вийти", action: "logout" },
  ],
  admin: [
    { label: "Профіль", path: "/profile" },
    { label: "Дашборд адміністратора", path: "/admin" },
    { label: "Вийти", action: "logout" },
  ],
};

const Menu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || "guest";
  const menuItems = menuConfig[role] || menuConfig["guest"];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-gray-100 px-6 py-3 shadow-md flex flex-wrap items-center justify-center md:justify-start">
      {menuItems.map((item, index) =>
        item.action === "logout" ? (
          <button
            key={index}
            onClick={handleLogout}
            className="mr-4 mb-2 px-3 py-1 rounded hover:bg-gray-700 transition-colors"
          >
            {item.label}
          </button>
        ) : (
          <NavLink
            key={index}
            to={item.path || "#"}
            className={({ isActive }) =>
              `mr-4 mb-2 px-3 py-1 rounded transition-colors ${
                isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            {item.label}
          </NavLink>
        )
      )}
    </nav>
  );
};

export { Menu };