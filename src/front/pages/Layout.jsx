import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
<<<<<<< HEAD
import { Cart } from "../components/Cart"
=======
import { Card } from "../components/Card"
>>>>>>> 65748fb5c428503638b90a8a9aef15c2f410855c

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <ScrollToTop>
<<<<<<< HEAD
            <Cart />
                <Outlet />
=======
            <Navbar />
            <Outlet />
>>>>>>> 65748fb5c428503638b90a8a9aef15c2f410855c
            <Footer />
        </ScrollToTop>
    )
}