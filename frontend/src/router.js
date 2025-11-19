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
                    {path: "create-brand-model", element: <CreateBrandModelPage/>},
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


// // 20251111 Підправляю доступ по ролях на /users
// import React from "react";
// import { createBrowserRouter, Outlet } from "react-router-dom";
//
// import { MainLayout } from "./layouts/main-layout/MainLayout";
// import { NotFoundPage } from "./pages/NotFoundPage";
// import { WelcomePage } from "./pages/WelcomePage";
// import { CarPostersPage } from "./pages/CarPostersPage";
// import { CarDetailsPage } from "./pages/CarDetailsPage";
// import { LoginPage } from "./pages/LoginPage";
// import { RegistrationPage } from "./pages/RegistrationPage";
// import { ProfilePage } from "./pages/ProfilePage";
// import { CreateCarPosterPage } from "./pages/CreateCarPosterPage";
// import { EditCarPosterPage } from "./pages/EditCarPosterPage";
// import { UserCarPostersPage } from "./pages/UserCarPostersPage";
// import { ManagerDashboardPage } from "./pages/ManagerDashboardPage";
// import { AdminDashboardPage } from "./pages/AdminDashboardPage";
// import { ModerationPage } from "./pages/ModerationPage";
// import { UsersComponent } from "./components/users-component/UsersComponent";
// import { ExchangeRatesPage } from "./pages/ExchangeRatesPage";
// import { StatisticsPage } from "./pages/StatisticsPage";
// import { SettingsPage } from "./pages/SettingsPage";
//
// import { ProtectedRouteComponent } from "./components/protected-route-component/ProtectedRouteComponent";
//
// // сторінки користувачів
// import { UserDetailsPage } from "./pages/UserDetailsPage";
// import { EditUserPage } from "./pages/EditUserPage";
//
// const router = createBrowserRouter([
//   {
//     path: "",
//     element: <MainLayout />,
//     errorElement: <NotFoundPage />,
//     children: [
//       // 🟢 Публічні маршрути
//       { index: true, element: <WelcomePage /> },
//       { path: "cars", element: <CarPostersPage /> },
//       { path: "cars/:id", element: <CarDetailsPage /> },
//       { path: "login", element: <LoginPage /> },
//       { path: "register", element: <RegistrationPage /> },
//       { path: "profile", element: <ProfilePage /> },
//
//       // 🔒 Для продавців (seller)
//       {
//         element: (
//           <ProtectedRouteComponent role="seller">
//             <Outlet />
//           </ProtectedRouteComponent>
//         ),
//         children: [
//           { path: "create-car", element: <CreateCarPosterPage /> },
//           { path: "my-cars", element: <UserCarPostersPage /> },
//         ],
//       },
//
//       // 🔒 Для продавця, менеджера або адміна (редагування авто)
//       {
//         element: (
//           <ProtectedRouteComponent role={["seller", "manager", "admin"]}>
//             <Outlet />
//           </ProtectedRouteComponent>
//         ),
//         children: [
//           { path: "cars/:id/edit", element: <EditCarPosterPage /> },
//         ],
//       },
//
//       // 🔒 Для менеджера
//       {
//         element: (
//           <ProtectedRouteComponent role="manager">
//             <Outlet />
//           </ProtectedRouteComponent>
//         ),
//         children: [{ path: "manager", element: <ManagerDashboardPage /> }],
//       },
//
//       // 🔒 Для адміна
//       {
//         element: (
//           <ProtectedRouteComponent role="admin">
//             <Outlet />
//           </ProtectedRouteComponent>
//         ),
//         children: [
//           { path: "admin", element: <AdminDashboardPage /> },
//           { path: "exchange-rates", element: <ExchangeRatesPage /> },
//           { path: "statistics", element: <StatisticsPage /> },
//           { path: "settings", element: <SettingsPage /> },
//         ],
//       },
//
//       // 🔒 Спільні маршрути для buyer, seller, manager, admin — користувачі
//       {
//         element: (
//           <ProtectedRouteComponent
//             role={["buyer", "seller", "manager", "admin"]}
//           >
//             <Outlet />
//           </ProtectedRouteComponent>
//         ),
//         children: [
//           { path: "users", element: <UsersComponent /> },
//           { path: "users/:id", element: <UserDetailsPage /> },
//           { path: "users/:id/edit", element: <EditUserPage /> },
//         ],
//       },
//
//       // ❌ 404
//       { path: "*", element: <NotFoundPage /> },
//     ],
//   },
// ]);
//
// export { router };


// 20251101 Роблю зміни, щоб покупець і продавець могли бачити свій профіль. Код зверху.
// import React from "react";
// import {createBrowserRouter, Outlet} from "react-router-dom";
//
// import {MainLayout} from "./layouts/main-layout/MainLayout";
// import {NotFoundPage} from "./pages/NotFoundPage";
// import {WelcomePage} from "./pages/WelcomePage";
// import {CarPostersPage} from "./pages/CarPostersPage";
// import {CarDetailsPage} from "./pages/CarDetailsPage";
// import {LoginPage} from "./pages/LoginPage";
// import {RegistrationPage} from "./pages/RegistrationPage";
// import {ProfilePage} from "./pages/ProfilePage";
// import {CreateCarPosterPage} from "./pages/CreateCarPosterPage";
// import {EditCarPosterPage} from "./pages/EditCarPosterPage";
// import {UserCarPostersPage} from "./pages/UserCarPostersPage";
// import {ManagerDashboardPage} from "./pages/ManagerDashboardPage";
// import {AdminDashboardPage} from "./pages/AdminDashboardPage";
// import {ModerationPage} from "./pages/ModerationPage";
// import {UsersComponent} from "./components/users-component/UsersComponent";
// import {ExchangeRatesPage} from "./pages/ExchangeRatesPage";
// import {StatisticsPage} from "./pages/StatisticsPage";
// import {SettingsPage} from "./pages/SettingsPage";
//
// import {ProtectedRouteComponent} from "./components/protected-route-component/ProtectedRouteComponent";
//
// // імпорт сторінки деталей користувача та сторінки редагування
// import {UserDetailsPage} from "./pages/UserDetailsPage";
// import {EditUserPage} from "./pages/EditUserPage"; // тимчасова або реальна сторінка редагування
//
// const router = createBrowserRouter([
//     {
//         path: "",
//         element: <MainLayout/>,
//         errorElement: <NotFoundPage/>,
//         children: [
//             // Публічні маршрути
//             {index: true, element: <WelcomePage/>},
//             {path: "cars", element: <CarPostersPage/>},
//             {path: "cars/:id", element: <CarDetailsPage/>},
//             {path: "login", element: <LoginPage/>},
//             {path: "register", element: <RegistrationPage/>},
//             {path: "profile", element: <ProfilePage/>},
//
//             // 🔒 Маршрути лише для продавця
//             {
//                 element: (
//                     <ProtectedRouteComponent role="seller">
//                         <Outlet/>
//                     </ProtectedRouteComponent>
//                 ),
//                 children: [
//                     {path: "create-car", element: <CreateCarPosterPage/>},
//                     {path: "my-cars", element: <UserCarPostersPage/>},
//                 ],
//             },
//
//             // 🔒 Маршрути для продавця, менеджера або адміна (редагування оголошення)
//             {
//                 element: (
//                     <ProtectedRouteComponent role={["seller", "manager", "admin"]}>
//                         <Outlet/>
//                     </ProtectedRouteComponent>
//                 ),
//                 children: [{path: "cars/:id/edit", element: <EditCarPosterPage/>}],
//             },
//
//             // 🔒 Маршрути тільки для менеджера
//             {
//                 element: (
//                     <ProtectedRouteComponent role="manager">
//                         <Outlet/>
//                     </ProtectedRouteComponent>
//                 ),
//                 children: [{path: "manager", element: <ManagerDashboardPage/>}],
//             },
//
//             // 🔒 Маршрути спільні для менеджера та адміна
//             {
//                 element: (
//                     <ProtectedRouteComponent role={["manager", "admin"]}>
//                         <Outlet/>
//                     </ProtectedRouteComponent>
//                 ),
//                 children: [
//                     {path: "moderation", element: <ModerationPage/>},
//
//                     // список користувачів
//                     {path: "users", element: <UsersComponent/>},
//
//                     // деталі користувача (тут вирішується твоя помилка)
//                     {path: "users/:id", element: <UserDetailsPage/>},
//
//                     // сторінка редагування користувача
//                     {path: "users/:id/edit", element: <EditUserPage/>},
//                 ],
//             },
//
//             // 🔒 Звичайний користувач (buyer / seller) — може редагувати тільки себе
//             {
//                 element: (
//                     <ProtectedRouteComponent role={["buyer", "seller"]}>
//                         <Outlet/>
//                     </ProtectedRouteComponent>
//                 ),
//                 children: [
//                     {path: "users/:id", element: <UserDetailsPage/>},
//                     {path: "users/:id/edit", element: <EditUserPage/>},
//                 ],
//             },
//
//             // 🔒 Маршрути лише для адміна
//             {
//                 element: (
//                     <ProtectedRouteComponent role="admin">
//                         <Outlet/>
//                     </ProtectedRouteComponent>
//                 ),
//                 children: [
//                     {path: "admin", element: <AdminDashboardPage/>},
//                     {path: "exchange-rates", element: <ExchangeRatesPage/>},
//                     {path: "statistics", element: <StatisticsPage/>},
//                     {path: "settings", element: <SettingsPage/>},
//                 ],
//             },
//         ],
//     },
// ]);
//
// export {router};


// 20251025 Низ коментую, а зверху буде удосконалений роутер. Ми такого на навчанні не проходили.
//     Це порада від ШІ.
// import React from "react";
// import {createBrowserRouter} from "react-router-dom";
//
//
// import {NotFoundPage} from "./pages/NotFoundPage";
// import {CarPostersPage} from "./pages/CarPostersPage";
// import {LoginPage} from "./pages/LoginPage";
// import {ManagerDashboardPage} from "./pages/ManagerDashboardPage";
// import {AdminDashboardPage} from "./pages/AdminDashboardPage";
// import {CreateCarPosterPage} from "./pages/CreateCarPosterPage";
// import {RegistrationPage} from "./pages/RegistrationPage";
// import {UserCarPostersPage} from "./pages/UserCarPostersPage";
// import {ProtectedRouteComponent} from "./components/protected-route-component/ProtectedRouteComponent";
// import {MainLayout} from "./layouts/main-layout/MainLayout";
// import {WelcomePage} from "./pages/WelcomePage";
// import {ProfilePage} from "./pages/ProfilePage";
// import {CarDetailsPage} from "./pages/CarDetailsPage";
// import {EditCarPosterPage} from "./pages/EditCarPosterPage";
// import {ModerationPage} from "./pages/ModerationPage";
// import {ExchangeRatesPage} from "./pages/ExchangeRatesPage";
// import {StatisticsPage} from "./pages/StatisticsPage";
// import {SettingsPage} from "./pages/SettingsPage";
// import {UsersComponent} from "./components/users-component/UsersComponent";
//
// const router = createBrowserRouter([
//     {
//         path: "",
//         element: <MainLayout/>,
//         errorElement: <NotFoundPage/>,
//         children: [
//             {index: true, element: <WelcomePage/>},
//             {path: "cars", element: <CarPostersPage/>},
//             {path: "login", element: <LoginPage/>},
//             {path: "register", element: <RegistrationPage/>},
//             {path: "profile", element: <ProfilePage/>},
//             {path: "cars/:id", element: <CarDetailsPage/>},
//
//             {
//                 path: "create-car",
//                 element: (
//                     <ProtectedRouteComponent role="seller">
//                         <CreateCarPosterPage/>
//                     </ProtectedRouteComponent>
//                 ),
//             },
//             {
//                 path: "cars/:id/edit",
//                 element: (
//                     <ProtectedRouteComponent role={["seller", "manager", "admin"]}>
//                         <EditCarPosterPage/>
//                     </ProtectedRouteComponent>
//                 ),
//             },
//             {
//                 path: "my-cars",
//                 element: (
//                     <ProtectedRouteComponent role="seller">
//                         <UserCarPostersPage/>
//                     </ProtectedRouteComponent>
//                 ),
//             },
//             {
//                 path: "manager",
//                 element: (
//                     <ProtectedRouteComponent role="manager">
//                         <ManagerDashboardPage/>
//                     </ProtectedRouteComponent>
//                 ),
//             },
//             {
//                 path: "admin",
//                 element: (
//                     <ProtectedRouteComponent role="admin">
//                         <AdminDashboardPage/>
//                     </ProtectedRouteComponent>
//                 ),
//             },
//             {
//                 path: "moderation",
//                 element: (
//                     <ProtectedRouteComponent role={["manager", "admin"]}>
//                         <ModerationPage/>
//                     </ProtectedRouteComponent>
//                 ),
//             },
//             {
//                 path: "users",
//                 element: (
//                     <ProtectedRouteComponent role={["manager", "admin"]}>
//                         <UsersComponent/>
//                     </ProtectedRouteComponent>
//                 ),
//             },
//             {
//                 path: "exchange-rates",
//                 element: (
//                     <ProtectedRouteComponent role="admin">
//                         <ExchangeRatesPage/>
//                     </ProtectedRouteComponent>
//                 ),
//             },
//             {
//                 path: "statistics",
//                 element: (
//                     <ProtectedRouteComponent role="admin">
//                         <StatisticsPage/>
//                     </ProtectedRouteComponent>
//                 ),
//             },
//             {
//                 path: "settings",
//                 element: (
//                     <ProtectedRouteComponent role="admin">
//                         <SettingsPage/>
//                     </ProtectedRouteComponent>
//                 ),
//             },
//         ],
//     },
// ]);
//
// export {router};


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
