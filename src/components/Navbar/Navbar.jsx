/* eslint-disable react-hooks/exhaustive-deps */
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import NotificationsIcon from "../NotificationsIcon/NotificationsIcon";

export default function Navbar() {
  const navigate =useNavigate()
  const [isLogedIn, setIsLogedIn] = useState(Cookies.get('userToken')?true:false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  useEffect(()=>{
    async function getInfo() {
      if(Cookies.get('userToken')?false:true){
        setIsLogedIn(false)
        navigate('/login')
         return;
        }
      try {
        const [profileResponse,notificationRes,notificationCountRes] = await Promise.all([
          axios.get('https://route-posts.routemisr.com/users/profile-data',{
                headers:{
                    'Token':Cookies.get('userToken')
                }}),
          axios.get('https://route-posts.routemisr.com/notifications?page=1&limit=50',{
                headers:{
                    'Token':Cookies.get('userToken')
                }}),
          axios.get('https://route-posts.routemisr.com/notifications/unread-count',{
                headers:{
                    'Token':Cookies.get('userToken')
                }}),
  
        ]) 

        localStorage.setItem('photo',profileResponse.data.data.user.photo)
        localStorage.setItem('name',profileResponse.data.data.user.name)
        setNotifications(notificationRes.data.data.notifications)
        setNotificationsCount(notificationCountRes.data.data.unreadCount)
        const following = JSON.stringify(profileResponse.data.data.user.following)
        Cookies.set("following",following)

      } catch (error) {
        console.log(error.response);
        if(error.response.data.errors === "invalid token .. login again" || error.response.data.errors === "token not provided"){Cookies.remove('userToken')}
      }
      
    }
  if(isLogedIn){
    getInfo();

    const intervalId = setInterval(() => {
      getInfo();
    }, 5000);

   return ()=> clearInterval(intervalId)
  }
},[])

  
  return <>

    <nav className={`fixed z-8 top-0 w-full dark:bg-[#252728] border-b p-2 flex ${isLogedIn?'justify-between':"justify-center"} items-center gap-3 text-white`}>

       {isLogedIn&&<h1 onClick={()=>{navigate('/'); window.location.reload() }} className="text-3xl cursor-pointer rounded-full px-2">LinkPost</h1>}
      <div className="flex gap-2">
       {/* {isLogedIn&&<NavLink to={'/'} className="cursor-pointer self-center"><HomeIcon/></NavLink>} */}
        {!isLogedIn&&<NavLink to={'/login'} className="cursor-pointer self-center ">Login</NavLink>}
        {!isLogedIn&&<NavLink to={'signup'} className="cursor-pointer self-center ">SignUp</NavLink>}

      </div>
      <div className="flex items-center justify-center">
      {isLogedIn&&<NotificationsIcon notifications={notifications} notificationsCount={notificationsCount}/>
      }
      

       {isLogedIn&& <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="rounded-full size-fit cursor-pointer">
        <Avatar className={`size-10`}>
          <AvatarImage src={localStorage.getItem('photo')}  alt="shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </Button>} />
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem className={`cursor-pointer`} onClick={()=>navigate(`/profile/${Cookies.get('userId')}`)} >Profile</DropdownMenuItem>
          <DropdownMenuItem className={`cursor-pointer`} onClick={()=>navigate('/settings')} >Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className={`cursor-pointer`} onClick={()=>{Cookies.remove('userToken'); Cookies.remove('userId'); Cookies.remove('following'); setIsLogedIn(false); navigate('/login') }}  variant="destructive">Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
        }
        
      </div>
    </nav>
  </>
}
