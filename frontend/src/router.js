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
import {EditCarPosterPage} from "./pages/EditCarPosterPage";
import {ModerationPage} from "./pages/ModerationPage";
import {ExchangeRatesPage} from "./pages/ExchangeRatesPage";
import {StatisticsPage} from "./pages/StatisticsPage";
import {SettingsPage} from "./pages/SettingsPage";
import {UsersComponent} from "./components/users-component/UsersComponent";

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
                path: "cars/:id/edit",
                element: (
                    <ProtectedRouteComponent role={["seller", "manager", "admin"]}>
                        <EditCarPosterPage/>
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
            {
                path: "moderation",
                element: (
                    <ProtectedRouteComponent role={["manager", "admin"]}>
                        <ModerationPage/>
                    </ProtectedRouteComponent>
                ),
            },
            {
                path: "users",
                element: (
                    <ProtectedRouteComponent role={["manager", "admin"]}>
                        <UsersComponent/>
                    </ProtectedRouteComponent>
                ),
            },
            {
                path: "exchange-rates",
                element: (
                    <ProtectedRouteComponent role="admin">
                        <ExchangeRatesPage/>
                    </ProtectedRouteComponent>
                ),
            },
            {
                path: "statistics",
                element: (
                    <ProtectedRouteComponent role="admin">
                        <StatisticsPage/>
                    </ProtectedRouteComponent>
                ),
            },
            {
                path: "settings",
                element: (
                    <ProtectedRouteComponent role="admin">
                        <SettingsPage/>
                    </ProtectedRouteComponent>
                ),
            },
        ],
    },
]);

export {router};


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
