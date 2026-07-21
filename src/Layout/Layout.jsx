import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import Footer from "@/components/Footer/Footer";

export default function Layout() {
  const [profile, setProfile] = useState([])
  const location = useLocation();
  useEffect(()=>{
    async function getprofile() {
     const profileRes = await axios.get("https://route-posts.routemisr.com/users/profile-data", {
              headers: {
                Token: Cookies.get("userToken"),
              },
            })
            setProfile(profileRes.data.data.user)
    }
    getprofile();
  },[])
  return<>
  <Navbar/>
  {!location.pathname.includes('/profile')&&Cookies.get('userToken')&&<Sidebar profile={profile} />}
    <Outlet key={location.pathname}></Outlet>
    <Footer photo={localStorage.getItem('photo')} />
  </>
}
