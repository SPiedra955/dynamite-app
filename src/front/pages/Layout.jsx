import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Slide } from "../components/Slide"
import { Plans } from "../components/Plans"
import { Separator } from "../components/Separator"
import { ImageUploader } from "../components/ImageUploader"
import { Card } from "../components/Card"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <ScrollToTop>
            <Navbar />
            <Slide />    
            <Card />        
            {/*<Outlet />*/}
            <ImageUploader />
            <Plans />
            <Separator />
            <Footer />
        </ScrollToTop>
    )
}