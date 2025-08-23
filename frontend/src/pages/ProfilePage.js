// const ProfilePage = () => {
//     return (
//         <div>
//             <div>ProfilePage</div>
//         </div>
//     );
// };
//
// export {ProfilePage};

import React from "react";
import {useAuth} from "../context/AuthContext";
import {Navigate} from "react-router-dom";

const ProfilePage = () => {
    const {user, isAuthenticated, logout} = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login"/>;
    }

    return (
        <div>
            <h2>Мій профіль</h2>
            <p>Логін: {user?.email}</p>
            {/*<p>Email: {user?.email}</p>*/}
            {/*<p>Роль: {user?.role}</p>*/}
            {/*<p>Тип акаунту: {user?.account_type}</p>*/}
            <button onClick={logout}>Вийти</button>
        </div>
    );
};

export {ProfilePage};
