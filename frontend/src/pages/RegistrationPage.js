import React, { useState } from "react";
import { Link } from "react-router-dom";

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // TODO: запит до /users на створення юзера
      alert("Реєстрація ще не підключена до бекенду.");
    } catch (err) {
      setError("Помилка реєстрації.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Реєстрація
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4"
        >
          <label className="flex flex-col text-gray-100">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col text-gray-100">
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col text-gray-100">
            Роль
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="buyer">Покупець</option>
              <option value="seller">Продавець</option>
            </select>
          </label>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors disabled:opacity-50"
          >
            {loading ? "Створення..." : "Зареєструватися"}
          </button>
        </form>
        <p className="text-gray-300 mt-4 text-center">
          Вже маєте акаунт?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Увійдіть
          </Link>
        </p>
      </div>
    </div>
  );
};

export { RegistrationPage };