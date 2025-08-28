import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";


const ProtectedRouteComponent = ({children, role}) => {
    const {isAuthenticated, user} = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{from: location}}/>;
    }

    if (role && user?.role !== role) {
        return <Navigate to="/" replace/>;
    }

    return children;
}

export {ProtectedRouteComponent}