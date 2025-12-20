import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true); // 🆕 додаємо loading

  // 🔹 Завантаження стану з localStorage при старті
  useEffect(() => {
    const savedTokens = localStorage.getItem("tokens");
    const savedUser = localStorage.getItem("user");

    if (savedTokens) {
      try {
        setTokens(JSON.parse(savedTokens));
      } catch {
        localStorage.removeItem("tokens");
      }
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false); // ✅ коли все перевірено — вимикаємо "завантаження"
  }, []);

  // 🔹 Вхід у систему (після login API)
  const login = (userData, tokenData) => {
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tokens", JSON.stringify(tokenData));
  };

  // 🔹 Оновлення тільки токенів (наприклад, після refresh)
  const updateTokens = (newTokens) => {
    setTokens(newTokens);
    localStorage.setItem("tokens", JSON.stringify(newTokens));
  };

  // 🔹 Вихід із системи
  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    authService.logout();
  };

  const value = useMemo(
    () => ({
      user,
      tokens,
      isAuthenticated: !!tokens,
      loading, // 🆕 додаємо до контексту
      login,
      updateTokens,
      logout,
    }),
    [user, tokens, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };