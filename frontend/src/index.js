// import ReactDOM from 'react-dom/client';
// import {RouterProvider} from "react-router-dom";
// import {router} from "./router";
//
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <RouterProvider router={router}/>
// );

import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);