import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CarDetailsComponent } from "../components/car-details-component/CarDetailsComponent";
import { carService } from "../services/carsService";

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




// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {CarDetailsComponent} from "../components/car-details-component/CarDetailsComponent";
// import {carService} from "../services/carsService";
// // import { carService } from "../../services/carsService";
// // import { CarDetailsComponent } from "../car-details-component/CarDetailsComponent";
//
// const CarDetailsPage = () => {
//   const { id } = useParams();
//   const [car, setCar] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//
//   useEffect(() => {
//     setLoading(true);
//     carService
//       .getCarById(id)
//       .then((res) => {
//         console.log("Car data from backend:", res.data); // Для відслідковування
//         setCar(res.data); // Беремо лише res.data, а не весь об’єкт Axios
//       })
//       .catch((err) => {
//         console.error("Error fetching car:", err);
//         setError("Не вдалося завантажити інформацію про авто.");
//       })
//       .finally(() => setLoading(false));
//   }, [id]);
//
//   if (loading) return <p>Дані завантажуються...</p>;
//   if (error) return <p>{error}</p>;
//
//   return <CarDetailsComponent car={car} />;
// };
//
// export { CarDetailsPage };



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {carService as carsService} from "../services/carsService";
// import {CarDetailsComponent} from "../components/car-details-component/CarDetailsComponent";
//
// const CarDetailsPage = () => {
//   const { id } = useParams();
//   const [car, setCar] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//
//   useEffect(() => {
//     const fetchCar = async () => {
//       try {
//         const data = await carsService.getCarById(id);
//         setCar(data);
//       } catch (err) {
//         setError("Не вдалося завантажити інформацію про авто.");
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchCar();
//   }, [id]);
//
//   if (loading) return <p>Завантаження...</p>;
//   if (error) return <p className="text-red-600">{error}</p>;
//
//   return (
//     <div className="p-6">
//       <CarDetailsComponent car={car} />
//     </div>
//   );
// };
//
// export {CarDetailsPage};
