import { NavLink } from "react-router-dom";
import Cookies from 'js-cookie'

export default function Footer({photo}) {

  return<nav className="fixed z-1 gap-3 md:hidden flex justify-center items-center bottom-0 w-full dark:bg-[#252728] px-2 py-2 border-t">
    <NavLink to={'/'} className={`w-full flex justify-center`}  >
        <i className="fa-solid fa-house text-2xl"></i>
    </NavLink>
    <NavLink to={'/suggestions'} className={`w-full flex justify-center`}  >
        <i className="fa-solid fa-user-group text-2xl"></i>
    </NavLink>
    <NavLink to={'/bookmarks'} className={`w-full flex justify-center`}  >
        <i className="fa-solid fa-bookmark text-2xl"></i>
    </NavLink>
    <NavLink to={'/notifications'} className={`w-full flex justify-center`}  >
        <i className="fa-solid fa-bell text-2xl"></i>
    </NavLink>
    <NavLink to={`/profile/${Cookies.get('userId')}`} className={`w-full flex justify-center`}>
        <img src={photo} className="size-9 object-cover rounded-full" alt="" />
    </NavLink>
  </nav>
}
