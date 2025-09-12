import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { setAuthContext } from "./services/apiService";
import './index.css';

// 🔹 Обгортка, яка бере контекст і передає його в apiService
const ApiServiceInitializer = ({ children }) => {
const auth = useAuth();
setAuthContext(auth);
return children;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<AuthProvider>
<ApiServiceInitializer>
<RouterProvider router={router} />
</ApiServiceInitializer>
</AuthProvider>
);




//
// import ReactDOM from "react-dom/client";
// import { RouterProvider } from "react-router-dom";
// import { router } from "./router";
// import { AuthProvider } from "./context/AuthContext";
// import './index.css';
//
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <AuthProvider>
//     <RouterProvider router={router} />
//   </AuthProvider>
// );


// import ReactDOM from 'react-dom/client';
// import {RouterProvider} from "react-router-dom";
// import {router} from "./router";
//
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <RouterProvider router={router}/>
// );
