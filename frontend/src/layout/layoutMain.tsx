import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { GetCart } from "../hooks/getCartHooks";
import { NotificationCenter } from "../components/ui/notificationCenter";


export const MainLayout = () => {
    GetCart();

    return (
        <div className="min-h-screen flex flex-col">
        <NotificationCenter />
        <Navbar/>
        <main className="flex-1">
            <Outlet/>
        </main>
        <Footer/>

    </div>
    )
}
