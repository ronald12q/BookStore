import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";



export const MainLayout = () => {

    return (
        <div className="min-h-screen flex flex-col-1">
        <Navbar/>
        <main className="flex-1">
            <Outlet/>
        </main>

    </div>
    )
}