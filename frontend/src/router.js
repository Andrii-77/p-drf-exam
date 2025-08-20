// import { createBrowserRouter, Navigate } from "react-router-dom";
// import {MainLayout} from "./layouts/MainLayout/MainLayout";
// import {LoginPage} from "./pages/LoginPage";
// import {CarPostersPage} from "./pages/CarPostersPage";
//
// const router = createBrowserRouter([
//     {
//         path:'', element:<MainLayout/>, children:[
//             {
//                 index:true, element:<Navigate to={'login'}/>
//             },
//             {
//                 path:'login', element: <LoginPage/>
//             },
//             {
//                 path:'cars', element: <CarPostersPage/>
//             }
//         ]
//     }
// ])
//
// export {router}

import React from "react";
import {createBrowserRouter} from "react-router-dom";



import {NotFoundPage} from "./pages/NotFoundPage";
import {CarPostersPage} from "./pages/CarPostersPage";
import {LoginPage} from "./pages/LoginPage";
import {ManagerDashboardPage} from "./pages/ManagerDashboardPage";
import {AdminDashboardPage} from "./pages/AdminDashboardPage";
import {CreateCarPosterPage} from "./pages/CreateCarPosterPage";
import {RegistrationPage} from "./pages/RegistrationPage";
import {UserCarPostersPage} from "./pages/UserCarPostersPage";
import {ProtectedRoute} from "./components/ProtectedRouteComponent/ProtectedRoute";
import {MainLayout} from "./layouts/MainLayout/MainLayout";
import {WelcomePage} from "./pages/WelcomePage";

const router = createBrowserRouter([
    {
        path: "",
        element: <MainLayout/>,
        errorElement: <NotFoundPage/>,
        children: [
            {index: true, element: <WelcomePage/>},
            {path: "cars", element: <CarPostersPage/>},
            {path: "login", element: <LoginPage/>},
            {path: "register", element: <RegistrationPage/>},

            {
                path: "create-car",
                element: (
                    <ProtectedRoute role="seller">
                        <CreateCarPosterPage/>
                    </ProtectedRoute>
                ),
            },
            {
                path: "my-cars",
                element: (
                    <ProtectedRoute role="seller">
                        <UserCarPostersPage/>
                    </ProtectedRoute>
                ),
            },
            {
                path: "manager",
                element: (
                    <ProtectedRoute role="manager">
                        <ManagerDashboardPage/>
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin",
                element: (
                    <ProtectedRoute role="admin">
                        <AdminDashboardPage/>
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export {router}