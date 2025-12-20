import React, { useEffect, useState } from "react";
import { carService } from "../services/carService";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const CreateBrandModelPage = () => {
    const navigate = useNavigate();

    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [backendError, setBackendError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // === useForm ===
    const {
        register,
        handleSubmit,
        reset,
        watch
    } = useForm({
        defaultValues: {
            brand: "",
            model: ""
        }
    });

    const newBrand = watch("brand");
    const newModel = watch("model");

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
        setBackendError(null);
        setSuccessMessage(null);
        reset({ model: "" });

        if (numericId) {
            carService
                .getModels({ brand: numericId })
                .then((res) => setModels(res.data || []))
                .catch(() =>
                    setBackendError({ detail: "Помилка при завантаженні моделей." })
                );
        }
    };

    // === Створення бренду ===
    const handleCreateBrand = async ({ brand }) => {
        if (!brand.trim()) {
            setBackendError({ detail: "Введіть назву бренду!" });
            return;
        }

        const existingBrand = findDuplicateBrand(brand);

        if (existingBrand) {
            setBackendError({
                detail: `Бренд '${brand}' вже існує як "${existingBrand.brand}"!`,
            });
            return;
        }

        try {
            await carService.createBrand({ brand: brand.trim() });
            setSuccessMessage(`✅ Бренд '${brand}' успішно створено!`);

            reset({ brand: "", model: "" });

            const res = await carService.getBrands();
            setBrands(res.data || []);
        } catch (err) {
            setBackendError(
                err.response?.data || { detail: "Помилка при створенні бренду" }
            );
        }
    };

    // === Створення моделі ===
    const handleCreateModel = async ({ model }) => {
        if (!selectedBrand) {
            setBackendError({ detail: "Спершу оберіть бренд!" });
            return;
        }

        if (!model.trim()) {
            setBackendError({ detail: "Введіть назву моделі!" });
            return;
        }

        const existingModel = findDuplicateModel(model);
        if (existingModel) {
            setBackendError({
                detail: `Модель '${model}' вже існує як "${existingModel.model}"!`,
            });
            return;
        }

        try {
            await carService.createModel({
                brand: selectedBrand,
                model: model.trim(),
            });

            setSuccessMessage(`✅ Модель '${model}' успішно створено!`);
            reset({ model: "" });

            const res = await carService.getModels({ brand: selectedBrand });
            setModels(res.data || []);
        } catch (err) {
            setBackendError(
                err.response?.data || { detail: "Помилка при створенні моделі" }
            );
        }
    };

    // === Класи стилів ===
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

                {/* Повідомлення */}
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

                {/* === Форма створення бренду === */}
                <form onSubmit={handleSubmit(handleCreateBrand)}>
                    <label className="flex flex-col text-gray-100">
                        Новий бренд
                        <input
                            type="text"
                            {...register("brand")}
                            className={inputClass}
                            placeholder="Введіть назву бренду"
                        />
                    </label>

                    <button
                        type="submit"
                        className={buttonClass + " border-blue-500"}
                        disabled={!newBrand?.trim()}
                    >
                        Створити бренд
                    </button>
                </form>

                {/* === Форма створення моделі === */}
                <form onSubmit={handleSubmit(handleCreateModel)}>
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
                            {...register("model")}
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
                        type="submit"
                        className={buttonClass + " border-green-500"}
                        disabled={!selectedBrand || !newModel?.trim()}
                    >
                        Створити модель
                    </button>
                </form>
            </div>
        </div>
    );
};

export { CreateBrandModelPage };