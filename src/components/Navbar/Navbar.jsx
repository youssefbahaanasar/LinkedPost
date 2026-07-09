import { NavLink, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { useState } from "react";
import { Button } from "../ui/button";
export default function Navbar() {
   const [isLogedIn, setIsLogedIn] = useState(Cookies.get('userToken'));
   const navigate =useNavigate()
  return <>
    <nav className="absolute top-0 w-full bg-black p-3 flex justify-center gap-3 text-white">
       {isLogedIn&&<NavLink to={'/'} className="cursor-pointer self-center">Home</NavLink>}
        {!isLogedIn&&<NavLink to={'/login'} className="cursor-pointer  ">Login</NavLink>}
        {!isLogedIn&&<NavLink to={'signup'} className="cursor-pointer ">SignUp</NavLink>}
        {isLogedIn&&<Button onClick={()=>{Cookies.remove('userToken'); setIsLogedIn(false); navigate('/login') }} to={'signup'} variant="link" className="cursor-pointer text-md">Logout</Button> }
    </nav>
  </>
}
