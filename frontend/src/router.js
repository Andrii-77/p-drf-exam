import { createBrowserRouter, Navigate } from "react-router-dom";
import {MainLayout} from "./layouts/MainLayout/MainLayout";
import {LoginPage} from "./pages/LoginPage";
import {CarPostersPage} from "./pages/CarPostersPage";

const router = createBrowserRouter([
    {
        path:'', element:<MainLayout/>, children:[
            {
                index:true, element:<Navigate to={'login'}/>
            },
            {
                path:'login', element: <LoginPage/>
            },
            {
                path:'cars', element: <CarPostersPage/>
            }
        ]
    }
])

export {router}