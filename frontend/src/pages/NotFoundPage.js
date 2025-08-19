import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section>
      <h1>404 — Сторінку не знайдено</h1>
      <p>
        <Link to="/">На головну</Link>
      </p>
    </section>
  );
}

export {NotFoundPage}