import { NavLink } from "react-router-dom"
import Cookies from 'js-cookie'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
export default function Sidebar() {

  return<>
  <nav className="fixed hidden lg:grid grid-cols-12 grid-rows-6 gap-3 w-75 xl:w-fit top-20 left-2 xl:left-15 p-3 rounded-lg border ps-2 bg-[#1C1C1D]">
  
  <NavLink to={`/profile/${Cookies.get('userId')}`} className="cursor-pointer py-1 hover:text-[#2B7FFF] col-span-12 grid hover:bg-white/10 ps-1 rounded-lg grid-cols-14 items-center gap-2">
    <div className="col-span-2 flex justify-center">

    <Avatar className={`size-9 shrink-0`}>
          <AvatarImage src={localStorage.getItem('photo')}  alt="shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    </div>
    <div className="col-span-12">
    <span className="pt-1 text-sm">{localStorage.getItem('name')}</span>
    </div>
  </NavLink>

  <NavLink to={'/'}  className="cursor-pointer py-1 hover:text-[#2B7FFF] col-span-12 grid  hover:bg-white/10 ps-1 rounded-lg grid-cols-14 items-center gap-2">
    <div className="col-span-2 flex justify-center">
        <i className="fa-solid fa-house text-xl"></i>

    </div>
    <div className="col-span-12">
     <span className="pt-1 text-sm">Home Feed</span>
    </div>
  </NavLink>
    
  <NavLink to={'/suggestions'}   className="cursor-pointer py-1 hover:text-[#2B7FFF] col-span-12 grid hover:bg-white/10 ps-1 rounded-lg grid-cols-14 items-center gap-2">
    <div className="col-span-2 flex justify-center">
        <i className="fa-solid fa-user-plus text-xl"></i>
    </div>
    <div className="col-span-12">
     <span className="pt-1 text-sm">Grow your network</span>
    </div>
  </NavLink>

  <NavLink to={'/bookmarks'}  className="cursor-pointer py-1 hover:text-[#2B7FFF] col-span-12 grid hover:bg-white/10 ps-1 rounded-lg grid-cols-14 items-center gap-2">
    <div className="col-span-2 flex justify-center">
        <i className="fa-solid fa-bookmark text-xl"></i>
    </div>
    <div className="col-span-12">
     <span className="pt-1 text-sm">Saved</span>
    </div>
  </NavLink>

  <NavLink to={'/notifications'}  className="cursor-pointer py-1 hover:text-[#2B7FFF] col-span-12 grid hover:bg-white/10 ps-1 rounded-lg grid-cols-14 items-center gap-2">
    <div className="col-span-2 flex justify-center">
        <i className="fa-solid fa-bell text-xl"></i>
    </div>
    <div className="col-span-12">
     <span className="pt-1 text-sm">Notifications</span>
    </div>
  </NavLink>
  
  <NavLink to={'/settings'}  className="cursor-pointer py-1 hover:text-[#2B7FFF] col-span-12 grid hover:bg-white/10 ps-1 rounded-lg grid-cols-14 items-center gap-2">
    <div className="relative col-span-2 flex justify-center">
        <i className="fa-solid fa-gear text-xl"></i>

    </div>
    <div className="col-span-12">
     <span className="pt-1 text-sm">Settings</span>
    </div>
  </NavLink>

  </nav>
  </>
}
