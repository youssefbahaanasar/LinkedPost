import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

export default function Layout() {
  return<>
  <Navbar/>
    <div className="container mx-auto min-h-screen flex justify-center items-center">
    <Outlet></Outlet>
    </div>
    
  <Footer/>
  </>
}
