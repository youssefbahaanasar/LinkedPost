import Follow from "@/components/Follow/Follow";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Cookies from 'js-cookie'
import axios from "axios";

export default function Followings() {
  const navigate = useNavigate();
  const {id} = useParams();
  const [profile, setProfile] = useState([])

  useEffect(()=>{
    async function getFollowings() {
      try {
       const profileResponse = await axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
              headers: {
                Token: Cookies.get("userToken"),
              },
            })
       setProfile(profileResponse.data.data.user)
      } catch (error) {
        console.log(error.response);
        
      }
    }
    getFollowings()
  },[])
  
  return <>
  <div className="grid grid-cols-13 py-20 ">
    <div className="flex items-center col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-8 lg:col-start-5 gap-4 bg-[#252728] p-8  rounded-lg mb-5">
     <div className="size-15 flex items-center justify-center shrink-0  bg-[#2B7FFF] rounded-full ">
     <i className="fa-solid fa-user-plus text-3xl "></i>
     </div>

      <div className="">
          <h1 className="text-2xl ">{profile.name?.split(' ',2).join(' ')}'s followings</h1>
          <p className="text-xs mt-2">Explore {profile.name?.split(' ',2).join(' ')}'s followings and interstes.</p>    
      </div>
    </div>
            <div className="gap-3 col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-8 lg:col-start-5 grid grid-cols-2 px-1 sm:grid-cols-9 md:grid-cols-12 xl:grid-cols-10 ">
              {profile?.following?.map((follower) => (
                  <div className="p-0 col-span-1 sm:col-span-3 md:col-span-3 xl:col-span-2 z-1">
                    <Card className="relative mx-auto w-full max-w-sm pt-0 ">
                      <div onClick={()=>navigate(`/profile/${follower._id}`)} className="overflow-hidden">
                      <img
                        src={follower.photo}
                        alt="Event cover"
                        className="relative z-20 aspect-square w-full object-cover cursor-pointer transition-all duration-400 hover:scale-125 "
                      />
                      </div>
                      <CardHeader>
                        <CardTitle onClick={()=>navigate(`/profile/${follower.id}`)} className="capitalize line-clamp-1 cursor-pointer hover:underline w-fit">
                          {follower.name}
                        </CardTitle>
                        <CardDescription>
                          Followed by {follower.followersCount}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Follow userId={follower._id} />
                      </CardFooter>
                    </Card>
                  </div>
              ))}
            </div>
</div>
  </>
}
