import React, { useEffect, useState } from "react";
import { carService } from "../services/carService";
import { useNavigate } from "react-router-dom";

const CreateBrandModelPage = () => {
    const navigate = useNavigate();

    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [newBrand, setNewBrand] = useState("");
    const [newModel, setNewModel] = useState("");
    const [backendError, setBackendError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // --- Повернення назад ---
    const handleGoBack = () => {
        navigate(-1);
    };

    // Завантаження брендів
    useEffect(() => {
        carService
            .getBrands()
            .then((res) => setBrands(res.data || []))
            .catch(() =>
                setBackendError({ detail: "Помилка при завантаженні брендів." })
            );
    }, []);

    // Пошук дубліката бренду
    const findDuplicateBrand = (brandName) => {
        return brands.find(
            (b) => b.brand.toLowerCase() === brandName.toLowerCase()
        );
    };

    // Пошук дубліката моделі
    const findDuplicateModel = (modelName) => {
        return models.find(
            (m) => m.model.toLowerCase() === modelName.toLowerCase()
        );
    };

    const handleBrandChange = (brandId) => {
        const numericId = parseInt(brandId, 10) || "";
        setSelectedBrand(numericId);
        setModels([]);
        setNewModel("");
        setBackendError(null);
        setSuccessMessage(null);

        if (numericId) {
            carService
                .getModels({ brand: numericId })
                .then((res) => setModels(res.data || []))
                .catch(() =>
                    setBackendError({ detail: "Помилка при завантаженні моделей." })
                );
        }
    };

    const handleCreateBrand = async () => {
        if (!newBrand.trim()) {
            setBackendError({ detail: "Введіть назву бренду!" });
            return;
        }

        const existingBrand = findDuplicateBrand(newBrand);

        if (existingBrand) {
            setBackendError({
                detail: `Бренд '${newBrand}' вже існує як "${existingBrand.brand}"!`,
            });
            return;
        }

        try {
            await carService.createBrand({ brand: newBrand.trim() });
            setSuccessMessage(`✅ Бренд '${newBrand}' успішно створено!`);
            setNewBrand("");

            const res = await carService.getBrands();
            setBrands(res.data || []);
        } catch (err) {
            setBackendError(
                err.response?.data || { detail: "Помилка при створенні бренду" }
            );
        }
    };

    const handleCreateModel = async () => {
        if (!selectedBrand) {
            setBackendError({ detail: "Спершу оберіть бренд!" });
            return;
        }

        if (!newModel.trim()) {
            setBackendError({ detail: "Введіть назву моделі!" });
            return;
        }

        const existingModel = findDuplicateModel(newModel);

        if (existingModel) {
            setBackendError({
                detail: `Модель '${newModel}' вже існує як "${existingModel.model}" для цього бренду!`,
            });
            return;
        }

        try {
            await carService.createModel({
                brand: selectedBrand,
                model: newModel.trim(),
            });

            setSuccessMessage(`✅ Модель '${newModel}' успішно створено!`);
            setNewModel("");

            const res = await carService.getModels({ brand: selectedBrand });
            setModels(res.data || []);
        } catch (err) {
            setBackendError(
                err.response?.data || { detail: "Помилка при створенні моделі" }
            );
        }
    };

    const inputClass =
        "mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

    const buttonClass =
        "w-full mt-2 py-3 text-center font-semibold rounded-lg border border-gray-600 transition " +
        "bg-gray-700 hover:bg-gray-600 text-white shadow-md " +
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700";

    const modelInputClass =
        inputClass + (selectedBrand ? "" : " bg-gray-700/60 cursor-not-allowed");

    return (
        <div className="flex justify-center items-center min-h-[80vh] p-4">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-lg">

                {/* Кнопка повернення */}
                <div className="mb-4">
                    <button
                        onClick={handleGoBack}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded-lg text-white shadow transition"
                    >
                        ← Повернутись
                    </button>
                </div>

                <h1 className="text-2xl font-bold text-gray-100 mb-4 text-center">
                    Створити бренд та модель
                </h1>

                {backendError && (
                    <div className="mb-4 p-3 rounded bg-red-800 text-red-200 text-sm relative">
                        ⚠ {backendError.detail}
                        <button
                            onClick={() => setBackendError(null)}
                            className="absolute top-1 right-2 hover:text-white"
                        >
                            ✖
                        </button>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 rounded bg-green-800 text-green-200 text-sm relative">
                        {successMessage}
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="absolute top-1 right-2 hover:text-white"
                        >
                            ✖
                        </button>
                    </div>
                )}

                {/* Створення бренду */}
                <label className="flex flex-col text-gray-100">
                    Новий бренд
                    <input
                        type="text"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        className={inputClass}
                        placeholder="Введіть назву бренду"
                    />
                </label>

                <button
                    type="button"
                    onClick={handleCreateBrand}
                    className={buttonClass + " border-blue-500"}
                    disabled={!newBrand.trim()}
                >
                    Створити бренд
                </button>

                {/* Створення моделі */}
                <label className="flex flex-col text-gray-100 mt-4">
                    Бренд для моделі
                    <select
                        value={selectedBrand}
                        onChange={(e) => handleBrandChange(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">-- Виберіть бренд --</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.brand}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col text-gray-100 mt-2">
                    Нова модель
                    <input
                        type="text"
                        value={newModel}
                        onChange={(e) => setNewModel(e.target.value)}
                        className={modelInputClass}
                        placeholder={
                            selectedBrand
                                ? "Введіть назву моделі"
                                : "Оберіть бренд, щоб додати модель"
                        }
                        disabled={!selectedBrand}
                    />
                </label>

                {!selectedBrand && (
                    <p className="text-gray-400 text-sm mt-1">
                        Спершу оберіть бренд, щоб створити модель.
                    </p>
                )}

                <button
                    type="button"
                    onClick={handleCreateModel}
                    className={buttonClass + " border-green-500"}
                    disabled={!selectedBrand || !newModel.trim()}
                >
                    Створити модель
                </button>
            </div>
        </div>
    );
};

export { CreateBrandModelPage };


// 20251119 Початковий робочий варіант.
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { carService } from "../services/carService";
//
// const CreateBrandModelPage = () => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();
//
//   const [brands, setBrands] = useState([]);
//   const [models, setModels] = useState([]);
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [newBrand, setNewBrand] = useState("");
//   const [newModel, setNewModel] = useState("");
//   const [backendError, setBackendError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//
//   // Завантаження брендів
//   useEffect(() => {
//     carService
//       .getBrands()
//       .then((res) => setBrands(res.data || []))
//       .catch(() =>
//         setBackendError({ detail: "Помилка при завантаженні брендів." })
//       );
//   }, []);
//
//   // Перевірка дубліката бренду
//   const isDuplicateBrand = (brandName) => {
//     return brands.some((b) => b.brand.toLowerCase() === brandName.toLowerCase());
//   };
//
//   // Перевірка дубліката моделі
//   const isDuplicateModel = (modelName) => {
//     return models.some((m) => m.model.toLowerCase() === modelName.toLowerCase());
//   };
//
//   const handleBrandChange = (brandId) => {
//     const numericId = parseInt(brandId, 10);
//     setSelectedBrand(numericId);
//     setModels([]);
//     setNewModel("");
//     setBackendError(null);
//     setSuccessMessage(null);
//
//     if (numericId) {
//       carService
//         .getModels({ brand: numericId })
//         .then((res) => setModels(res.data || []))
//         .catch(() =>
//           setBackendError({ detail: "Помилка при завантаженні моделей." })
//         );
//     }
//   };
//
//   const handleCreateBrand = async () => {
//     if (!newBrand.trim()) {
//       setBackendError({ detail: "Введіть назву бренду!" });
//       return;
//     }
//     if (isDuplicateBrand(newBrand)) {
//       setBackendError({ detail: `Бренд '${newBrand}' вже існує!` });
//       return;
//     }
//     try {
//       await carService.createBrand({ brand: newBrand.trim() });
//       setSuccessMessage(`✅ Бренд '${newBrand}' успішно створено!`);
//       setNewBrand("");
//       // Перезавантажуємо список брендів
//       const res = await carService.getBrands();
//       setBrands(res.data || []);
//     } catch (err) {
//       setBackendError(err.response?.data || { detail: "Помилка при створенні бренду" });
//     }
//   };
//
//   const handleCreateModel = async () => {
//     if (!selectedBrand) {
//       setBackendError({ detail: "Спершу оберіть бренд!" });
//       return;
//     }
//     if (!newModel.trim()) {
//       setBackendError({ detail: "Введіть назву моделі!" });
//       return;
//     }
//     if (isDuplicateModel(newModel)) {
//       setBackendError({ detail: `Модель '${newModel}' вже існує для цього бренду!` });
//       return;
//     }
//     try {
//       await carService.createModel({ brand: selectedBrand, model: newModel.trim() });
//       setSuccessMessage(`✅ Модель '${newModel}' успішно створено!`);
//       setNewModel("");
//       // Перезавантажуємо список моделей для бренду
//       const res = await carService.getModels({ brand: selectedBrand });
//       setModels(res.data || []);
//     } catch (err) {
//       setBackendError(err.response?.data || { detail: "Помилка при створенні моделі" });
//     }
//   };
//
//   const inputClass =
//     "mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";
//
//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-lg">
//         <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
//           Створити бренд та модель
//         </h1>
//
//         {backendError && (
//           <div className="mb-4 p-3 rounded bg-red-800 text-red-200 text-sm relative">
//             ⚠ {backendError.detail}
//             <button
//               onClick={() => setBackendError(null)}
//               className="absolute top-1 right-2 hover:text-white"
//             >
//               ✖
//             </button>
//           </div>
//         )}
//
//         {successMessage && (
//           <div className="mb-4 p-3 rounded bg-green-800 text-green-200 text-sm relative">
//             {successMessage}
//             <button
//               onClick={() => setSuccessMessage(null)}
//               className="absolute top-1 right-2 hover:text-white"
//             >
//               ✖
//             </button>
//           </div>
//         )}
//
//         {/* --- Створення нового бренду --- */}
//         <label className="flex flex-col text-gray-100">
//           Новий бренд
//           <input
//             type="text"
//             value={newBrand}
//             onChange={(e) => setNewBrand(e.target.value)}
//             className={inputClass}
//             placeholder="Введіть назву бренду"
//           />
//         </label>
//         <button
//           type="button"
//           onClick={handleCreateBrand}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors disabled:opacity-50 mt-2"
//           disabled={!newBrand.trim()}
//         >
//           Створити бренд
//         </button>
//
//         {/* --- Створення нової моделі --- */}
//         <label className="flex flex-col text-gray-100 mt-4">
//           Бренд для моделі
//           <select
//             value={selectedBrand}
//             onChange={(e) => handleBrandChange(e.target.value)}
//             className={inputClass}
//           >
//             <option value="">-- Виберіть бренд --</option>
//             {brands.map((b) => (
//               <option key={b.id} value={b.id}>
//                 {b.brand}
//               </option>
//             ))}
//           </select>
//         </label>
//
//         <label className="flex flex-col text-gray-100 mt-2">
//           Нова модель
//           <input
//             type="text"
//             value={newModel}
//             onChange={(e) => setNewModel(e.target.value)}
//             className={inputClass}
//             placeholder="Введіть назву моделі"
//           />
//         </label>
//         <button
//           type="button"
//           onClick={handleCreateModel}
//           className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow transition-colors mt-2 ${
//             !selectedBrand ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={!selectedBrand || !newModel.trim()}
//         >
//           Створити модель
//         </button>
//       </div>
//     </div>
//   );
// };
//
// export { CreateBrandModelPage };