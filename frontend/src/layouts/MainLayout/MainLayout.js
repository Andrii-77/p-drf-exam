// import { Outlet } from "react-router-dom";
//
// const MainLayout = () => {
//     return (
//         <div>
//             <div>MainLayout</div>
//             <Outlet/>
//         </div>
//     );
// };
//
// export {MainLayout};

import React from "react";
import {Outlet} from "react-router-dom";
import {Menu} from "../../components/Menu/MenuComponent";

const MainLayout = () => {
    return (
        <div style={{minHeight: "100vh", display: "flex", flexDirection: "column"}}>
            <Menu/>
            <main style={{flex: 1, maxWidth: 1200, margin: "0 auto", padding: "16px"}}>
                <Outlet/>
            </main>
            <footer style={{borderTop: "1px solid #eee", padding: "12px 16px", textAlign: "center"}}>
                AutoRia Clone • стартова версія
            </footer>
        </div>
    );
}

export {MainLayout}