/* eslint-disable react-hooks/set-state-in-effect */
import axios from 'axios';
import Cookies from "js-cookie";
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { useNavigate } from 'react-router-dom';

export default function Follow({userId}) {
  const navigate = useNavigate();
  const [followed, setFollowed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(()=>{
    const followingCookie = JSON.parse(Cookies.get('following'))||"[]";
    followingCookie.includes(userId)?setFollowed(true):setFollowed(false);
  },[userId])
  const handleFollow = async ()=>{
    try{
      setIsLoading(true)
      const response = await axios.put(`https://route-posts.routemisr.com/users/${userId}/follow`,{},{headers:{Token:Cookies.get('userToken')}})
      console.log(response.data);
      if(followed){
      const followingCookie = JSON.parse(Cookies.get('following'))||"[]";
      const updateFollowings = followingCookie.filter((id) => id !== userId);
      Cookies.set('following',JSON.stringify(updateFollowings));
      setFollowed(false)
    }else{
        const followingCookie = JSON.parse(Cookies.get('following'))||"[]";
        const updateFollowings = [...followingCookie,userId];
        Cookies.set('following',JSON.stringify(updateFollowings));
        setFollowed(true);
        }
    }catch(error){
      console.log(error.data);
    }
    setIsLoading(false);
  }
  return <>
    {userId!=Cookies.get("userId")?<Button onClick={()=>handleFollow()} className="w-full bg-blue-400/20 text-blue-300/90 hover:bg-blue-400/40 cursor-pointer">
        {!isLoading?(followed?<p className='flex items-center justify-center gap-1' >Following<CheckCheck/></p>:"Follow"):<Spinner className={`animate-spin`}/>}  
    </Button>:
    <Button onClick={()=>navigate('/my-profile/')} className="w-full bg-blue-400/20 text-blue-300/90 hover:bg-blue-400/40 cursor-pointer">
       MyProfile
    </Button>
    }
  </>
}
