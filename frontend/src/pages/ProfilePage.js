import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h2>Мій профіль</h2>
      <p>Логін: {user?.name}</p>
      <button onClick={logout}>Вийти</button>
    </div>
  );
};

export {ProfilePage};
