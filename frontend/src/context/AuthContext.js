import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const savedTokens = localStorage.getItem("tokens");
    const savedUser = localStorage.getItem("user");
    if (savedTokens) {
      setTokens(JSON.parse(savedTokens));
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData, tokenData) => {
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tokens", JSON.stringify(tokenData));
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  };

  const value = useMemo(
    () => ({
      user,
      tokens,
      isAuthenticated: !!tokens,
      login,
      logout,
    }),
    [user, tokens]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export {AuthProvider}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return context;
}

export {useAuth}