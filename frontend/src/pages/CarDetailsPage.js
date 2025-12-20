import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CarDetailsComponent } from "../components/car-details-component/CarDetailsComponent";
import { carService } from "../services/carService";

const CarDetailsPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    carService
      .getCarById(id)
      .then((res) => {
        console.log("Car data from backend:", res.data);
        setCar(res.data);
      })
      .catch((err) => {
        console.error("Error fetching car:", err);
        setError("Не вдалося завантажити інформацію про авто.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-300 text-lg">Дані завантажуються...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );

  return <CarDetailsComponent car={car} />;
};

export { CarDetailsPage };