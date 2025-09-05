// import { createBrowserRouter, Navigate } from "react-router-dom";
// import {main-layout} from "./layouts/main-layout/main-layout";
// import {LoginPage} from "./pages/LoginPage";
// import {CarPostersPage} from "./pages/CarPostersPage";
//
// const router = createBrowserRouter([
//     {
//         path:'', element:<main-layout/>, children:[
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
import {ProtectedRouteComponent} from "./components/protected-route-component/ProtectedRouteComponent";
import {MainLayout} from "./layouts/main-layout/MainLayout";
import {WelcomePage} from "./pages/WelcomePage";
import {ProfilePage} from "./pages/ProfilePage";
import {CarDetailsPage} from "./pages/CarDetailsPage";

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
            {path: "profile", element: <ProfilePage/>},
            {path: "cars/:id", element: <CarDetailsPage/>},
            {
                path: "create-car",
                element: (
                    <ProtectedRouteComponent role="seller">
                        <CreateCarPosterPage/>
                    </ProtectedRouteComponent>
                ),
            },
            {
                path: "my-cars",
                element: (
                    <ProtectedRouteComponent role="seller">
                        <UserCarPostersPage/>
                    </ProtectedRouteComponent>
                ),
            },
            {
                path: "manager",
                element: (
                    <ProtectedRouteComponent role="manager">
                        <ManagerDashboardPage/>
                    </ProtectedRouteComponent>
                ),
            },
            {
                path: "admin",
                element: (
                    <ProtectedRouteComponent role="admin">
                        <AdminDashboardPage/>
                    </ProtectedRouteComponent>
                ),
            },
        ],
    },
]);

export {router}