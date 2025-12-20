import React from "react";
import {createBrowserRouter, Outlet} from "react-router-dom";

import {MainLayout} from "./layouts/main-layout/MainLayout";
import {NotFoundPage} from "./pages/NotFoundPage";
import {WelcomePage} from "./pages/WelcomePage";
import {CarPostersPage} from "./pages/CarPostersPage";
import {CarDetailsPage} from "./pages/CarDetailsPage";
import {LoginPage} from "./pages/LoginPage";
import {RegistrationPage} from "./pages/RegistrationPage";
import {ProfilePage} from "./pages/ProfilePage";
import {CreateCarPosterPage} from "./pages/CreateCarPosterPage";
import {EditCarPosterPage} from "./pages/EditCarPosterPage";
import {UserCarPostersPage} from "./pages/UserCarPostersPage";
import {ManagerDashboardPage} from "./pages/ManagerDashboardPage";
import {AdminDashboardPage} from "./pages/AdminDashboardPage";
import {ModerationPage} from "./pages/ModerationPage";
import {UsersComponent} from "./components/users-component/UsersComponent";
import {ExchangeRatesPage} from "./pages/ExchangeRatesPage";
import {StatisticsPage} from "./pages/StatisticsPage";
import {SettingsPage} from "./pages/SettingsPage";

import {ProtectedRouteComponent} from "./components/protected-route-component/ProtectedRouteComponent";

import {UserDetailsPage} from "./pages/UserDetailsPage";
import {EditUserPage} from "./pages/EditUserPage";
import {ChangePasswordPage} from "./pages/ChangePasswordPage";
import {CreateBrandModelPage} from "./pages/CreateBrandModelPage";
import {BrandsPage} from "./pages/BrandsPage";
import {ModelsPage} from "./pages/ModelsPage";
import {EditModelPage} from "./pages/EditModelPage";
import {EditBrandPage} from "./pages/EditBrandPage";
import {SupportRequestsPage} from "./pages/SupportRequestsPage";

const router = createBrowserRouter([
    {
        path: "",
        element: <MainLayout/>,
        errorElement: <NotFoundPage/>,
        children: [
            // 🟢 Публічні маршрути
            {index: true, element: <WelcomePage/>},
            {path: "cars", element: <CarPostersPage/>},
            {path: "cars/:id", element: <CarDetailsPage/>},
            {path: "login", element: <LoginPage/>},
            {path: "register", element: <RegistrationPage/>},
            {path: "profile", element: <ProfilePage/>},

            // 🔒 Для продавців (seller)
            {
                element: (
                    <ProtectedRouteComponent role="seller">
                        <Outlet/>
                    </ProtectedRouteComponent>
                ),
                children: [
                    {path: "create-car", element: <CreateCarPosterPage/>},
                    {path: "my-cars", element: <UserCarPostersPage/>},
                ],
            },

            // 🔒 Для продавця, менеджера або адміна (редагування авто)
            {
                element: (
                    <ProtectedRouteComponent role={["seller", "manager", "admin"]}>
                        <Outlet/>
                    </ProtectedRouteComponent>
                ),
                children: [{path: "cars/:id/edit", element: <EditCarPosterPage/>}],
            },

            // 🔒 Для менеджера
            {
                element: (
                    <ProtectedRouteComponent role="manager">
                        <Outlet/>
                    </ProtectedRouteComponent>
                ),
                children: [{path: "manager", element: <ManagerDashboardPage/>}],
            },

            // 🔒 Для адміна
            {
                element: (
                    <ProtectedRouteComponent role="admin">
                        <Outlet/>
                    </ProtectedRouteComponent>
                ),
                children: [
                    {path: "admin", element: <AdminDashboardPage/>},
                    {path: "exchange-rates", element: <ExchangeRatesPage/>},
                    {path: "statistics", element: <StatisticsPage/>},
                    {path: "settings", element: <SettingsPage/>},
                ],
            },

            // 🔒 Тільки для менеджера та адміна
            {
                element: (
                    <ProtectedRouteComponent role={["manager", "admin"]}>
                        <Outlet/>
                    </ProtectedRouteComponent>
                ),
                children: [
                    {path: "users", element: <UsersComponent/>},
                    {path: "moderation", element: <ModerationPage/>},
                    {path: "moderation/support-requests", element: <SupportRequestsPage/>},
                    {path: "create-brand-model", element: <CreateBrandModelPage/>},
                    {path: "brands", element: <BrandsPage/>},
                    {path: "brands/:id/edit", element: <EditBrandPage/>},
                    {path: "models", element: <ModelsPage/>},
                    {path: "models/:id/edit", element: <EditModelPage/>},
                ],
            },

            // 🔒 Деталі та редагування користувача — доступно всім ролям
            {
                element: (
                    <ProtectedRouteComponent
                        role={["buyer", "seller", "manager", "admin"]}
                    >
                        <Outlet/>
                    </ProtectedRouteComponent>
                ),
                children: [
                    {path: "users/:id", element: <UserDetailsPage/>},
                    {path: "users/:id/edit", element: <EditUserPage/>},
                    {path: "users/change-password", element: <ChangePasswordPage/>},
                ],
            },

            // ❌ 404
            {path: "*", element: <NotFoundPage/>},
        ],
    },
]);

export {router};