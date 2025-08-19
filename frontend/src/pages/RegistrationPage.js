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
    <section style={{ maxWidth: 480 }}>
      <h1>Реєстрація</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Пароль
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Роль
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="buyer">Покупець</option>
            <option value="seller">Продавець</option>
          </select>
        </label>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Створення..." : "Зареєструватися"}
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        Вже маєте акаунт? <Link to="/login">Увійдіть</Link>
      </p>
    </section>
  );
}

export {RegistrationPage}