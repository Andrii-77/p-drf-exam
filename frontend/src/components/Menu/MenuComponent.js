import { Link } from "react-router-dom";
import {useAuth} from "../../context/AuthContext";


// Конфігурація меню для різних ролей
const menuConfig = {
  guest: [
    { label: "Всі авто", path: "/" },
    { label: "Логін", path: "/login" },
    { label: "Реєстрація", path: "/register" },
  ],
  buyer: [
    { label: "Всі авто", path: "/" },
    { label: "Вийти", action: "logout" },
  ],
  seller: [
    { label: "Всі авто", path: "/" },
    { label: "Створити оголошення", path: "/create-car" },
    { label: "Мої авто", path: "/my-cars" },
    { label: "Вийти", action: "logout" },
  ],
  manager: [
    { label: "Всі авто", path: "/" },
    { label: "Дашборд менеджера", path: "/manager" },
    { label: "Вийти", action: "logout" },
  ],
  admin: [
    { label: "Всі авто", path: "/" },
    { label: "Дашборд адміністратора", path: "/admin" },
    { label: "Вийти", action: "logout" },
  ],
};

const Menu = () => {
  const { user, logout } = useAuth();

  // Якщо користувач не авторизований → guest
  const role = user?.role || "guest";
  const menuItems = menuConfig[role] || menuConfig["guest"];

  return (
    <nav style={{ padding: "10px", background: "#ddd" }}>
      {menuItems.map((item, index) =>
        item.action === "logout" ? (
          <button
            key={index}
            onClick={logout}
            style={{ marginRight: "10px" }}
          >
            {item.label}
          </button>
        ) : (
          <Link
            key={index}
            to={item.path || "#"}
            style={{ marginRight: "10px" }}
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}

export {Menu}
