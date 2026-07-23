import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import Footer from "@/components/Footer/Footer";

export default function Layout() {
  const [profile, setProfile] = useState([])
  const location = useLocation();
  const navigate = useNavigate()
  useEffect(()=>{
    async function getprofile() {
      if(Cookies.get('userToken')?false:true){
        Cookies.remove('userToken')
        Cookies.remove('userId')
        Cookies.remove('following')
        localStorage.removeItem('name')
        localStorage.removeItem('photo')
        navigate('/login'); 
        return;}
      try {
        const profileRes = await axios.get("https://route-posts.routemisr.com/users/profile-data", {
                 headers: {
                   Token: Cookies.get("userToken"),
                 },
               })
        setProfile(profileRes.data.data.user)
      } catch (error) {
        console.log(error.response);
        if(error.response.data.errors === "invalid token .. login again"){Cookies.remove('userToken')}
        
      }
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
