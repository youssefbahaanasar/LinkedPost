import axios from "axios"
import { useEffect, useRef, useState } from "react"
import Cookies from 'js-cookie'
import { CameraIcon, UploadCloudIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"


export default function Setttings() {
  const [profile, setProfile] = useState('')
  const [photo, setPhoto] = useState(' ')
  const [uploadImage, setUploadImage] = useState(false)
  const imageRef = useRef(null);
  useEffect(()=>{
    async function getBookmarks() {
    try {
        const profileResponse = await axios.get("https://route-posts.routemisr.com/users/profile-data", {
              headers: {
                Token: Cookies.get("userToken"),
              },
            })

        setProfile(profileResponse.data.data.user)
        setPhoto(profileResponse.data.data.user.photo)
      
      
    } catch (error) {
      console.log(error.response);
    }
  }
  getBookmarks();
    },[])
  function handleClick(){
    imageRef.current.click()
  }
 async function handleImage(){
    setUploadImage(true)
    const formData = new FormData();
    const image = imageRef.current?.files?.[0];
    if(image){ 
        formData.append('photo',image)
    }
    try {
        const response = await axios.put(`https://route-posts.routemisr.com/users/upload-photo`,formData,{
            headers:{Token:Cookies.get('userToken')}
        })
        setPhoto(response.data.data.photo)
    } catch (error) {
        console.log(error.response);
    }
    setUploadImage(false)
  }
  return<div className="grid grid-cols-13 gap-2 px-2 py-20">
    <div className="flex outline-1  hover:outline-blue-400 hover:-translate-y-1  transition-all col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5 gap-4 bg-[#252728] p-8  rounded-lg mb-5">
     <div className="p-3 shrink-0 size-15 bg-[#2B7FFF] rounded-full flex justify-center items-center">
      <i className="fa-solid fa-gear text-3xl"></i>
     </div>
      <div className="">
          <h1 className="text-3xl mt-1"> Settings </h1>
          <p className="text-sm">Manage your profile and security.</p>
      </div>
    </div>
    <div className="flex flex-col gap-2 items-center outline-1 hover:outline-blue-400 hover:-translate-y-1  transition-all col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5  bg-[#252728] p-8  rounded-lg mb-5">
     <div className="relative cursor-pointer ">
     <div className="relative rounded-full overflow-hidden group">
        
     <input onChange={handleImage} ref={imageRef} type="file" accept="image/*" className="hidden"  />
     <img onClick={handleClick} src={photo} className="size-32 object-cover  rounded-full border-4 border-blue-500/80 cursor-pointer" alt="" /> 
        <div onClick={handleClick} className={`absolute top-0 left-0 bottom-0 right-0 ${uploadImage?'opacity-100':'opacity-0'} group-hover:opacity-100 transition-all duration-300 text-xs flex flex-col items-center justify-center bg-black/60`}>{uploadImage?<Spinner className='animate-spin size-8'/>:<><UploadCloudIcon/><p>upload photo</p></>} </div>
     </div>
        <div className="absolute -bottom-1 right-0 bg-blue-500 w-fit p-1 hover:bg-blue-400 group rounded-full border-3 transition-all border-[#252728]"> <CameraIcon fill="white" className="stroke-blue-500 group-hover:stroke-blue-400 transition-all"/> </div>
     </div>
      <div className="text-center">
          <h1 className="text-md mt-1 font-bold capitalize -mb-1" > {profile.name} </h1>
          <span className="text-xs text-blue-400/90">@{profile.username}</span>
          <p className="text-[10px] mt-1">Click your avatar to change your profile photo</p>
      </div>
    </div>
            
</div>
}
