import axios from "axios";
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import GetPosts from "@/components/GetPosts/GetPosts";
import { Bookmark } from "lucide-react";

export default function BookMarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [photo, setPhoto] = useState('')
  useEffect(()=>{
    async function getBookmarks() {
    try {
        const [bookmarkResponse,profileResponse] = await Promise.all([
          axios.get(`https://route-posts.routemisr.com/users/bookmarks`,{headers:{
            Token:Cookies.get('userToken')
          }}),
          axios.get("https://route-posts.routemisr.com/users/profile-data", {
              headers: {
                Token: Cookies.get("userToken"),
              },
            }),
          
        ]) 
        setBookmarks(bookmarkResponse.data.data.bookmarks)
        setPhoto(profileResponse.data.data.user.photo)
      
      
    } catch (error) {
      console.log(error.response);
    }
  }
  getBookmarks();
},[])
console.log(photo);

  return <>
  <div className="py-20 "> 
    <div className="grid grid-cols-13 gap-2 px-2">
    <div className="flex col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5 gap-4 bg-[#252728] p-8  rounded-lg mb-5">
      <Bookmark fill="white" className="p-3 shrink-0 size-15 bg-[#2B7FFF] rounded-full"/>
      <div className="">
          <h1 className="text-3xl ">  Saved posts</h1>
          <p className="text-xs">Keep your favorite posts saved and access them anytime.</p>
          <span className="text-[#2B7FFF] text-sm font-bold">{bookmarks.length} saved post{bookmarks.length>1&&'s'}</span>
      </div>
    </div>
      {bookmarks.map((bookmark)=><GetPosts post={bookmark} photo={photo}/>
      )}
    </div>

  </div>
  </>
}
