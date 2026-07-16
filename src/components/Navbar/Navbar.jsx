import { NavLink, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
export default function Navbar() {
  const navigate =useNavigate()
  const [isLogedIn, setIsLogedIn] = useState(Cookies.get('userToken'));
  const [photo, setPhoto] = useState(false);
  useEffect(()=>{
    async function getProfile() {
      const response = await axios.get('https://route-posts.routemisr.com/users/profile-data',{
            headers:{
                'Token':Cookies.get('userToken')
            }})
      setPhoto(response.data.data.user.photo)
            
    }
  if(isLogedIn){
    getProfile();}
  },[])
  
  return <>
    <nav className={`fixed z-8 top-0 w-full dark:bg-[#252728] border-b p-2 flex ${isLogedIn?'justify-between':"justify-center"} items-center gap-3 text-white`}>

       {isLogedIn&&<h1 className="cursor-pointer border border-white/50 rounded-full px-2">Linked Post</h1>}
      <div className="flex gap-2">
       {isLogedIn&&<NavLink to={'/'} className="cursor-pointer self-center">Home</NavLink>}
        {!isLogedIn&&<NavLink to={'/login'} className="cursor-pointer self-center ">Login</NavLink>}
        {!isLogedIn&&<NavLink to={'signup'} className="cursor-pointer self-center ">SignUp</NavLink>}
        {isLogedIn&&<Button onClick={()=>{Cookies.remove('userToken'); Cookies.remove('userId'); setIsLogedIn(false); navigate('/login') }} to={'signup'} variant="link" className="h-auto cursor-pointer text-md">Logout</Button> }
      </div>
       {isLogedIn&&
       <div onClick={()=>navigate('/my-profile')} className="shrink-0 cursor-pointer rounded-full w-10 h-10 dark:bg-[#171718] ">
        {photo&&<img className="object-cover h-10 w-10  rounded-full" src={photo} alt="" />}
        </div>}
    </nav>
  </>
}
