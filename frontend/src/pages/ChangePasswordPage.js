import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {userService} from "../services/userService";

const ChangePasswordPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [backendError, setBackendError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // ✅ Стан для видимості паролів
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const newPassword = watch("new_password", "");

    const inputClass =
        "mt-1 px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

    const onSubmit = async (data) => {
        setBackendError(null);
        setSuccessMessage(null);

        try {
            await userService.changePassword({
                old_password: data.current_password,   // змінено
                new_password: data.new_password,
                confirm_password: data.confirm_password,
            });
            setSuccessMessage("✅ Пароль успішно змінено.");
        } catch (err) {
            if (err.response?.data) {
                setBackendError(err.response.data);
            } else {
                setBackendError({detail: "⚠ Виникла помилка при зміні пароля."});
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
                    🔑 Зміна пароля
                </h1>

                {successMessage && (
                    <div className="mb-4 p-3 rounded bg-green-800 text-green-200 relative">
                        {successMessage}
                        <button
                            onClick={() => navigate(-1)}
                            className="absolute top-1 right-2 hover:text-white"
                        >
                            ✖
                        </button>
                    </div>
                )}

                {backendError && (
                    <div className="mb-4 p-3 rounded bg-red-800 text-red-200 text-sm relative">
                        {backendError.detail && <p>{backendError.detail}</p>}
                        {Object.keys(backendError).map(
                            (field) =>
                                field !== "detail" && (
                                    <p key={field}>
                                        ⚠ {field}: {backendError[field]}
                                    </p>
                                )
                        )}
                        <button
                            onClick={() => setBackendError(null)}
                            className="absolute top-1 right-2 hover:text-white"
                        >
                            ✖
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">

                    {/* Поточний пароль */}
                    <label className="flex flex-col text-gray-100 relative">
                        Поточний пароль
                        <input
                            type={showCurrent ? "text" : "password"}
                            {...register("current_password", {required: true})}
                            className={inputClass}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-2 top-9 text-gray-400 hover:text-gray-100"
                        >
                            {showCurrent ? "🙈" : "👁️"}
                        </button>
                        {errors.current_password && (
                            <span className="text-red-500 text-sm">
                Вкажіть поточний пароль
              </span>
                        )}
                    </label>

                    {/* Новий пароль */}
                    <label className="flex flex-col text-gray-100 relative">
                        Новий пароль
                        <input
                            type={showNew ? "text" : "password"}
                            {...register("new_password", {required: true})}
                            className={inputClass}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-2 top-9 text-gray-400 hover:text-gray-100"
                        >
                            {showNew ? "🙈" : "👁️"}
                        </button>
                        {errors.new_password && (
                            <span className="text-red-500 text-sm">
                Вкажіть новий пароль
              </span>
                        )}
                    </label>

                    {/* Підтвердження пароля */}
                    <label className="flex flex-col text-gray-100 relative">
                        Підтвердження нового пароля
                        <input
                            type={showConfirm ? "text" : "password"}
                            {...register("confirm_password", {
                                required: true,
                                validate: (value) =>
                                    value === newPassword || "Паролі не співпадають",
                            })}
                            className={inputClass}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-2 top-9 text-gray-400 hover:text-gray-100"
                        >
                            {showConfirm ? "🙈" : "👁️"}
                        </button>
                        {errors.confirm_password && (
                            <span className="text-red-500 text-sm">
                {errors.confirm_password.message}
              </span>
                        )}
                    </label>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors"
                    >
                        💾 Змінити пароль
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded shadow transition-colors"
                    >
                        ⬅ Повернутися
                    </button>
                </form>
            </div>
        </div>
    );
};

export {ChangePasswordPage};