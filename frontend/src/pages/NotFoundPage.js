import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#f9fafb",
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#1f2937",
          }}
        >
          404 — Сторінку не знайдено
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#4b5563",
            marginBottom: "24px",
          }}
        >
          На жаль, сторінка, яку ви шукаєте, не існує.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            fontWeight: "bold",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
};

export { NotFoundPage };


// import React from "react";
// import { Link } from "react-router-dom";
//
// const NotFoundPage = () => {
//   return (
//     <section>
//       <h1>404 — Сторінку не знайдено</h1>
//       <p>
//         <Link to="/">На головну</Link>
//       </p>
//     </section>
//   );
// }
//
// export {NotFoundPage}