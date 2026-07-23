/* eslint-disable react-hooks/set-state-in-effect */
import Cookies from 'js-cookie'
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import GetPosts from "@/components/GetPosts/GetPosts";
import { useNavigate } from 'react-router-dom';
import PostNav from '@/components/PostNav/PostNav';


export default function Home() {
  const [posts,setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    if(!Cookies.get('userToken')){
      navigate('/login');
    }
    window.scrollTo({top:0, behavior:"smooth"});
  }, [navigate])


  useEffect(()=>{
    async function getPosts(){
      try {
        setIsLoading(true);
        const [postsResponse,profileResponse] = await Promise.all([
          axios.get(`https://route-posts.routemisr.com/posts?page=1&limit=50`,{
          headers:{
            'Token':Cookies.get('userToken')
          }}),
          axios.get("https://route-posts.routemisr.com/users/profile-data", {
              headers: {
                Token: Cookies.get("userToken"),
              },
            }),
        
      ]) 
          setPosts(postsResponse.data.data.posts)
          setProfile(profileResponse.data.data.user)
          window.scrollTo({top:0, behavior:"smooth"});
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false)
      }
    getPosts();
  },[])

  

  

  return <>
    <div className="py-20 ">
    <div className="grid grid-cols-13 gap-2">
      {isLoading&&
    <Card className="col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5 ">
      <CardHeader>
        <div className="flex w-fit items-center gap-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="grid gap-2">
            <Skeleton className="h-2 w-37.5" />
            <Skeleton className="h-2 w-25" />
          </div>
        </div>
        <Skeleton className="h-3 mt-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
      }
      {isLoading&&
    <Card className="col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5">
      <CardHeader>
        <div className="flex w-fit items-center gap-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="grid gap-2">
            <Skeleton className="h-2 w-37.5" />
            <Skeleton className="h-2 w-25" />
          </div>
          
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
      }

     {!isLoading&&<PostNav profile={profile} />}

      { posts.map((post)=>(
      <GetPosts key={post.id} post={post} photo={profile.photo} />
      )       
      )}
    </div>
    </div>
  </>
}
