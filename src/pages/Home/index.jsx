import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    if(!Cookies.get('userToken')){
      navigate('/login');
    }
  }, [navigate])
  
  return <>
    <h1 className="text-red-500">Home page</h1>
  </>
}
