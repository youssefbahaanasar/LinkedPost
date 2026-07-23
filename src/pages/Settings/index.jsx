import axios from "axios"
import { useEffect, useRef, useState } from "react"
import Cookies from 'js-cookie'
import { CameraIcon, UploadCloudIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import * as zod from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"



export default function Setttings() {
  const schema = zod.object(
    {    
      currentPassword:zod.string().nonempty("password is required"),
      newPassword:zod.string().nonempty("password is required").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        `
        <ul>
        <li>at least 8 characters</li>
        <li>at least 1 uppercase letter</li>
        <li>at least 1 lowercase letter</li>
        <li>at least 1 number </li>
        <li>at least 1 special character "#-?-!-@-$-%-^-&-*-" </li>
        </ul>
        `),
      confirmPassword:zod.string().nonempty("password is requierd"),
  } 
  ).refine((values)=>values.confirmPassword==values.newPassword,{path:['confirmPassword'],message:"Password didn't match"})
  const [profile, setProfile] = useState('')
  const [photo, setPhoto] = useState(' ')
  const [isloading, setIsloading] = useState(false)
  const [uploadImage, setUploadImage] = useState(false)
  const imageRef = useRef(null);
 
  useEffect(()=>{
    async function getInfo() {
      if(!Cookies.get('userToken')){ return;}
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
  getInfo();
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
  async function changePassword(data) {
    try {
      setIsloading(true)
      const response = await axios.patch(`https://route-posts.routemisr.com/users/change-password`,{
          "password": data.currentPassword,
        "newPassword": data.newPassword
      },{
        headers:{
          Token:Cookies.get('userToken'),
          'Content-Type':"application/json"
        }
      })
      console.log(response.data);
      if(response.data.success){
        
        setTimeout(() => {
          setIsloading(false)
          Cookies.remove('userToken')
          Cookies.remove('userId')
          Cookies.remove('following')
          localStorage.removeItem('name')
          localStorage.removeItem('photo')
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setTimeout(() => {
        setIsloading(false)
      }, 2000);
      console.log(error.response);
    }
  }

 const {handleSubmit,register,formState} = useForm({
    resolver:zodResolver(schema)
  })
  console.log(formState.errors);
  
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
    <div className="flex flex-col gap-2 items-center outline-1 hover:outline-blue-400 hover:-translate-y-1  transition-all col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5  bg-[#252728] p-8  rounded-lg mb-5">
        <form onSubmit={handleSubmit(changePassword)} className="flex flex-col gap-4 w-full">
            <h3 className="text-xl font-bold">Change Password</h3>
            <div className="">
            <fieldset  className={`${formState.errors.currentPassword?.message?'border-red-500 border-2':""} border rounded-md px-2 `}>
              <legend className={`${formState.errors.currentPassword?.message?'text-red-500':""} text-xs`}>Current password</legend>
          <Input id={'currentPassword'}   {...register('currentPassword',{required:"Password is required"})} className={`border-0 outline-0 focus-visible:ring-0 bg-[#252728]!`} type={'password'}/>
            </fieldset>
            {formState.errors.currentPassword?.message&&<p className={`${formState.errors.currentPassword?.message?'text-red-500':""} text-[12px] ps-2 `}>{formState.errors.currentPassword?.message}</p>}
            </div>
            <div className="">
            <fieldset  className={`${formState.errors.newPassword?.message?'border-red-500 border-2':""} border rounded-md px-2 `}>
              <legend className={`${formState.errors.newPassword?.message?'text-red-500':""} text-xs`}>New password</legend>
          <Input id={'newPassword'}   {...register('newPassword',{required:"Feild is required"})} className={`border-0 outline-0 focus-visible:ring-0 bg-[#252728]!`} type={'password'}/>
            </fieldset>
            {formState.errors.newPassword?.message&&<div 
              className="text-xs text-red-500 my-2 [&>ul]:list-disc [&>ul]:list-inside"
              dangerouslySetInnerHTML={{ __html: formState.errors.newPassword.message }} 
            />}
            </div>
            <div className="">
            <fieldset  className={`${formState.errors.confirmPassword?.message?'border-red-500 border-2':""} border rounded-md px-2 `}>
              <legend className={`${formState.errors.confirmPassword?.message?'text-red-500':""} text-xs`}>Confirm password</legend>
          <Input id={'confirmPassword'}   {...register('confirmPassword',{required:"Password is required"})} className={`border-0 outline-0 focus-visible:ring-0 bg-[#252728]!`} type={'password'}/>
            </fieldset>
            {formState.errors.confirmPassword?.message&&<p className={`${formState.errors.confirmPassword?.message?'text-red-500':""} text-[12px] ps-2 `}>{formState.errors.confirmPassword?.message}</p>}
            </div>
            <Button type='submit' disabled={isloading} >{isloading?<Spinner className={`animate-spin`} />:""} Change Password</Button>
        </form>
    </div>

            
</div>
}
