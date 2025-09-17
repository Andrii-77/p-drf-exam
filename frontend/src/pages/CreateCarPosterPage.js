import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {carService} from "../services/carService";
import {useNavigate} from "react-router-dom";

const CreateCarPosterPage = () => {
    const {
        register,
        handleSubmit,
        reset,
        resetField,
        setValue,
        formState: {errors},
    } = useForm();

    const navigate = useNavigate();

    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");

    // --- стани для "немає бренду/моделі"
    const [showNewBrand, setShowNewBrand] = useState(false);
    const [showNewModel, setShowNewModel] = useState(false);

    // ✅ завантаження брендів
    useEffect(() => {
        carService
            .getBrands()
            .then((res) => setBrands(res.data || []))
            .catch((err) => console.error("❌ Error fetching brands:", err));
    }, []);

    // ✅ при зміні бренду підтягувати моделі
    const handleBrandChange = (brandId) => {
        setSelectedBrand(brandId);
        resetField("model");
        setModels([]);

        if (brandId) {
            carService
                .getModels({brand: brandId})
                .then((res) => {
                    console.log("=== 📦 API ВІДПОВІДЬ /cars/models ===");
                    console.log("Повністю res:", res);
                    console.log("res.data:", res.data);
                    console.log("typeof res.data:", typeof res.data);
                    console.log("Ключі res.data:", Object.keys(res.data));
                    console.log("Масив моделей (якщо є):", res.data.data || res.data);

                    setModels(res.data.data || res.data || []);
                })
                .catch((err) => console.error("❌ Error fetching models:", err));
        }

        // if (brandId) {
        //   carService
        //     .getModels({ brand: brandId })
        //     .then((res) => setModels(res.data || []))
        //     .catch((err) => console.error("❌ Error fetching models:", err));
        // }
    };

    // ✅ сабміт оголошення
    const onSubmit = async (data) => {
        if (showNewBrand || showNewModel) {
            alert("⚠ Неможливо створити оголошення з новим брендом/моделлю. Спершу повідомте адміністрацію.");
            return;
        }

        try {
            await carService.createCar({
                brand: data.brand,
                model: data.model,
                description: data.description,
                original_price: data.original_price,
                original_currency: data.original_currency,
                location: data.location,
            });

            alert("✅ Оголошення створене успішно!");
            reset();
            navigate("/cars");
        } catch (e) {
            console.error(e);
            alert("❌ Помилка при створенні оголошення!");
        }
    };

    // ✅ повідомлення про відсутній бренд
    const reportBrand = (data) => {
        if (!data.newBrand) {
            alert("Введіть назву бренду!");
            return;
        }
        carService.reportMissingBrand({brand: data.newBrand});
        resetField("newBrand");
        setShowNewBrand(false);
    };

    // ✅ повідомлення про відсутню модель
    const reportModel = (data) => {
        if (!data.newModel) {
            alert("Введіть назву моделі!");
            return;
        }
        carService.reportMissingModel({brand: selectedBrand, model: data.newModel});
        resetField("newModel");
        setShowNewModel(false);
    };

    const inputClass =
        "mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-lg">
                <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
                    Створити оголошення
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    {/* === Бренд === */}
                    <label className="flex flex-col text-gray-100">
                        Бренд
                        <select
                            {...register("brand", {required: !showNewBrand})}
                            className={inputClass}
                            // onChange={(e) => handleBrandChange(e.target.value)}
                            onChange={(e) => {
                                const brandId = e.target.value;
                                console.log("👉 brandId у handleBrandChange:", brandId, typeof brandId);
                                handleBrandChange(brandId);
                            }}
                            disabled={showNewBrand}
                        >
                            <option value="">-- Виберіть бренд --</option>
                            {brands.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.brand}
                                </option>
                            ))}
                        </select>
                        {errors.brand && (
                            <span className="text-red-500 text-sm">Виберіть бренд</span>
                        )}
                    </label>

                    {/* Кнопка для нового бренду */}
                    <button
                        type="button"
                        onClick={() => setShowNewBrand((prev) => !prev)}
                        className="text-sm text-blue-400 hover:underline self-start"
                    >
                        {showNewBrand ? "✖ Приховати поле" : "Немає мого бренду?"}
                    </button>

                    {showNewBrand && (
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                {...register("newBrand")}
                                className={inputClass + " flex-1"}
                                placeholder="Введіть новий бренд"
                            />
                            <button
                                type="button"
                                onClick={handleSubmit(reportBrand)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded"
                            >
                                Повідомити
                            </button>
                        </div>
                    )}

                    {/* === Модель === */}
                    {selectedBrand && !showNewBrand && (
                        <>
                            <label className="flex flex-col text-gray-100">
                                Модель
                                <select
                                    {...register("model", {required: !showNewModel})}
                                    className={inputClass}
                                    disabled={showNewModel}
                                >
                                    <option value="">-- Виберіть модель --</option>
                                    {models.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.model}
                                        </option>
                                    ))}
                                </select>
                                {errors.model && (
                                    <span className="text-red-500 text-sm">Виберіть модель</span>
                                )}
                            </label>

                            <button
                                type="button"
                                onClick={() => setShowNewModel((prev) => !prev)}
                                className="text-sm text-blue-400 hover:underline self-start"
                            >
                                {showNewModel ? "✖ Приховати поле" : "Немає моєї моделі?"}
                            </button>

                            {showNewModel && (
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        {...register("newModel")}
                                        className={inputClass + " flex-1"}
                                        placeholder="Введіть нову модель"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSubmit(reportModel)}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded"
                                    >
                                        Повідомити
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* === Опис === */}
                    <label className="flex flex-col text-gray-100">
                        Опис
                        <textarea
                            {...register("description", {required: true})}
                            className={inputClass}
                            rows={4}
                        />
                        {errors.description && (
                            <span className="text-red-500 text-sm">Поле обов'язкове</span>
                        )}
                    </label>

                    {/* === Ціна === */}
                    <label className="flex flex-col text-gray-100">
                        Ціна
                        <input
                            type="number"
                            step="0.01"
                            {...register("original_price", {required: true})}
                            className={inputClass}
                        />
                        {errors.original_price && (
                            <span className="text-red-500 text-sm">Вкажіть ціну</span>
                        )}
                    </label>

                    {/* === Валюта === */}
                    <label className="flex flex-col text-gray-100">
                        Валюта
                        <select
                            {...register("original_currency", {required: true})}
                            className={inputClass}
                        >
                            <option value="UAH">₴ Гривня</option>
                            <option value="USD">$ Долар</option>
                            <option value="EUR">€ Євро</option>
                        </select>
                    </label>

                    {/* === Локація === */}
                    <label className="flex flex-col text-gray-100">
                        Локація
                        <input
                            type="text"
                            {...register("location", {required: true})}
                            className={inputClass}
                        />
                        {errors.location && (
                            <span className="text-red-500 text-sm">Поле обов'язкове</span>
                        )}
                    </label>

                    <button
                        type="submit"
                        disabled={showNewBrand || showNewModel}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors disabled:opacity-50"
                    >
                        Створити
                    </button>
                </form>
            </div>
        </div>
    );
};

export {CreateCarPosterPage};


// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { carService } from "../services/carService";
// import { useNavigate } from "react-router-dom";
//
// const CreateCarPosterPage = () => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm();
//
//   const navigate = useNavigate();
//
//   const [brands, setBrands] = useState([]);
//   const [models, setModels] = useState([]);
//   const [loading, setLoading] = useState(false);
//
//   // для показу інпутів
//   const [showNewBrand, setShowNewBrand] = useState(false);
//   const [showNewModel, setShowNewModel] = useState(false);
//
//   const selectedBrand = watch("brand");
//
//   useEffect(() => {
//     carService
//       .getBrands()
//       .then((res) => setBrands(res.data))
//       .catch((err) => console.error("❌ Error fetching brands:", err));
//   }, []);
//
//   useEffect(() => {
//     if (selectedBrand) {
//       carService
//         .getModels({ brand: selectedBrand })
//         .then((res) => setModels(res.data))
//         .catch((err) => console.error("❌ Error fetching models:", err));
//     } else {
//       setModels([]);
//     }
//   }, [selectedBrand]);
//
//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       await carService.createCar({
//         brand: data.brand,
//         model: data.model,
//         description: data.description,
//         original_price: data.price,
//         original_currency: data.currency,
//         location: data.location,
//       });
//
//       alert("✅ Оголошення створено!");
//       reset();
//       navigate("/cars");
//     } catch (err) {
//       console.error("❌ Error creating car:", err);
//       alert("Сталася помилка при створенні оголошення");
//     } finally {
//       setLoading(false);
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
//           Створити оголошення
//         </h1>
//
//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//           {/* Бренд */}
//           <label className="flex flex-col text-gray-100">
//             Бренд
//             <select {...register("brand", { required: true })} className={inputClass}>
//               <option value="">-- Виберіть бренд --</option>
//               {brands.map((b) => (
//                 <option key={b.id} value={b.id}>
//                   {b.brand}
//                 </option>
//               ))}
//             </select>
//             {errors.brand && (
//               <span className="text-red-500 text-sm">Виберіть бренд</span>
//             )}
//           </label>
//
//           {/* Кнопка для нового бренду */}
//           <button
//             type="button"
//             onClick={() => setShowNewBrand((prev) => !prev)}
//             className="text-sm text-blue-400 hover:underline self-start"
//           >
//             {showNewBrand ? "✖ Приховати поле" : "Немає мого бренду?"}
//           </button>
//
//           {showNewBrand && (
//             <label className="flex flex-col text-gray-100">
//               Новий бренд
//               <input
//                 type="text"
//                 {...register("newBrand")}
//                 className={inputClass}
//               />
//             </label>
//           )}
//
//           {/* Модель */}
//           {selectedBrand && (
//             <label className="flex flex-col text-gray-100">
//               Модель
//               <select {...register("model", { required: true })} className={inputClass}>
//                 <option value="">-- Виберіть модель --</option>
//                 {models.map((m) => (
//                   <option key={m.id} value={m.id}>
//                     {m.model}
//                   </option>
//                 ))}
//               </select>
//               {errors.model && (
//                 <span className="text-red-500 text-sm">Виберіть модель</span>
//               )}
//             </label>
//           )}
//
//           {/* Кнопка для нової моделі */}
//           {selectedBrand && (
//             <button
//               type="button"
//               onClick={() => setShowNewModel((prev) => !prev)}
//               className="text-sm text-blue-400 hover:underline self-start"
//             >
//               {showNewModel ? "✖ Приховати поле" : "Немає моєї моделі?"}
//             </button>
//           )}
//
//           {showNewModel && (
//             <label className="flex flex-col text-gray-100">
//               Нова модель
//               <input
//                 type="text"
//                 {...register("newModel")}
//                 className={inputClass}
//               />
//             </label>
//           )}
//
//           {/* Опис */}
//           <label className="flex flex-col text-gray-100">
//             Опис
//             <textarea
//               {...register("description", { required: true })}
//               className={inputClass}
//               rows={4}
//             />
//             {errors.description && (
//               <span className="text-red-500 text-sm">Поле обов'язкове</span>
//             )}
//           </label>
//
//           {/* Ціна */}
//           <label className="flex flex-col text-gray-100">
//             Ціна
//             <input
//               type="number"
//               step="0.01"
//               {...register("price", { required: true })}
//               className={inputClass}
//             />
//             {errors.price && (
//               <span className="text-red-500 text-sm">Вкажіть ціну</span>
//             )}
//           </label>
//
//           {/* Валюта */}
//           <label className="flex flex-col text-gray-100">
//             Валюта
//             <select {...register("currency", { required: true })} className={inputClass}>
//               <option value="UAH">₴ Гривня</option>
//               <option value="USD">$ Долар</option>
//               <option value="EUR">€ Євро</option>
//             </select>
//           </label>
//
//           {/* Локація */}
//           <label className="flex flex-col text-gray-100">
//             Локація
//             <input
//               type="text"
//               {...register("location", { required: true })}
//               className={inputClass}
//             />
//             {errors.location && (
//               <span className="text-red-500 text-sm">Поле обов'язкове</span>
//             )}
//           </label>
//
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors disabled:opacity-50"
//           >
//             {loading ? "Створення..." : "Створити"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
//
// export { CreateCarPosterPage };


// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { carService } from "../services/carService"; // 🔹 створимо далі
// import { useNavigate } from "react-router-dom";
//
// const CreateCarPosterPage = () => {
//   const { register, handleSubmit } = useForm();
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();
//
//   const getFieldError = (field) => errors?.[field]?.[0] || null;
//
//   const inputClass = (field) =>
//     `mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border focus:outline-none focus:ring-2 ${
//       getFieldError(field)
//         ? "border-red-500 focus:ring-red-500"
//         : "border-gray-700 focus:ring-blue-500"
//     }`;
//
//   const onSubmit = async (data) => {
//     setLoading(true);
//     setErrors({});
//     try {
//       await carService.createCar(data);
//       alert("Оголошення створене ✅");
//       navigate("/my-cars"); // 🔹 перенаправлення після створення
//     } catch (err) {
//       console.error("❌ CreateCarPoster error:", err);
//       setErrors(err.response?.data || { detail: "Невідома помилка" });
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
//           Створити оголошення
//         </h1>
//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//
//           {/* Марка */}
//           <label className="flex flex-col text-gray-100">
//             Марка
//             <input
//               type="text"
//               {...register("brand", { required: true })}
//               className={inputClass("brand")}
//             />
//             {getFieldError("brand") && (
//               <span className="text-red-500 text-sm">{getFieldError("brand")}</span>
//             )}
//           </label>
//
//           {/* Модель */}
//           <label className="flex flex-col text-gray-100">
//             Модель
//             <input
//               type="text"
//               {...register("model", { required: true })}
//               className={inputClass("model")}
//             />
//             {getFieldError("model") && (
//               <span className="text-red-500 text-sm">{getFieldError("model")}</span>
//             )}
//           </label>
//
//           {/* Ціна */}
//           <label className="flex flex-col text-gray-100">
//             Ціна
//             <input
//               type="number"
//               {...register("price", { required: true })}
//               className={inputClass("price")}
//             />
//             {getFieldError("price") && (
//               <span className="text-red-500 text-sm">{getFieldError("price")}</span>
//             )}
//           </label>
//
//           {/* Валюта */}
//           <label className="flex flex-col text-gray-100">
//             Валюта
//             <select {...register("currency")} className={inputClass("currency")}>
//               <option value="UAH">₴ Гривня</option>
//               <option value="USD">$ Долар</option>
//               <option value="EUR">€ Євро</option>
//             </select>
//             {getFieldError("currency") && (
//               <span className="text-red-500 text-sm">{getFieldError("currency")}</span>
//             )}
//           </label>
//
//           {/* Локація */}
//           <label className="flex flex-col text-gray-100">
//             Локація
//             <input
//               type="text"
//               {...register("location", { required: true })}
//               className={inputClass("location")}
//             />
//             {getFieldError("location") && (
//               <span className="text-red-500 text-sm">{getFieldError("location")}</span>
//             )}
//           </label>
//
//           {/* Опис */}
//           <label className="flex flex-col text-gray-100">
//             Опис
//             <textarea
//               {...register("description")}
//               className={inputClass("description")}
//             />
//             {getFieldError("description") && (
//               <span className="text-red-500 text-sm">{getFieldError("description")}</span>
//             )}
//           </label>
//
//           {/* Глобальна помилка */}
//           {errors.detail && (
//             <p className="text-red-500 text-sm text-center">{errors.detail}</p>
//           )}
//
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors disabled:opacity-50"
//           >
//             {loading ? "Створення..." : "Створити"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
//
// export { CreateCarPosterPage };