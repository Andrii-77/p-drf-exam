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