import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import axios from "axios";
import { ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import handleNotify from "@/Helpers/handleNotify";

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([])
    const [unReadCount, setUnReadCount] = useState(0)
    const [unRead, setUnRead] = useState(true)

    useEffect(()=>{
        async function getNotifications() {
            try {
                const [notificationRes,notificationCountRes] = await Promise.all([
          axios.get(`https://route-posts.routemisr.com/notifications?${!unRead&&`unread=${unRead}&`}page=1&limit=10`,{
                headers:{
                    'Token':Cookies.get('userToken')
                }}),
          axios.get('https://route-posts.routemisr.com/notifications/unread-count',{
                headers:{
                    'Token':Cookies.get('userToken')
                }}),
  
        ]) 
                setNotifications(notificationRes.data.data.notifications)
                setUnReadCount(notificationCountRes.data.data.unreadCount)
            } catch (error) {
                console.log(error.response);
                
            }
        }
        getNotifications()
    },[unRead])
    function handleDate(date) {
    const createdAt = new Date(date);
    const now = new Date();
    const diff= now-createdAt;
    const month = createdAt.toLocaleString("en-US",{
      month:'short'
    })
    const years =  Math.floor(diff / (1000 * 60 * 60 * 24 *365));
    const weaks =  Math.floor(diff / (1000 * 60 * 60 * 24 *7));
    const days =  Math.floor(diff / (1000 * 60 * 60 * 24 ));
    const hours =  Math.floor(diff / (1000 * 60 * 60 ));
    const minutes =  Math.floor(diff / (1000 * 60  ));
    const seconds =  Math.floor(diff / (1000 ));

    if(years>0)return `${createdAt.getFullYear()}-${month}-${createdAt.getDate()}`;
    else if(weaks>0 && weaks<4)return `${weaks} weak${weaks>1?'s':""} ago`;
    else if(days>0 && days<7)return `${days} day${days>1?'s':""} ago`
    else if(hours>0 && hours<24)return `${hours} hour${hours>1?'s':""} ago`;
    else if(minutes>0 && minutes<60) return `${minutes} minute${minutes>1?'s':""} ago`;
    else if(seconds>=0 && seconds<60) return "Just now";
    else return `${createdAt.getDate()} ${month} at ${createdAt.getHours().toString().padStart(2,"0")}:${createdAt.getMinutes().toString().padStart(2,"0")}`
  }

  async function markAllAsRead() {
    await axios.patch(`https://route-posts.routemisr.com/notifications/read-all`,{},{
        headers:{Token:Cookies.get('userToken')}
    })

  }
  return <>
    <div className="grid grid-cols-13 py-20 px-2">
        <div className="flex col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5 gap-4 bg-[#252728] p-8  rounded-lg mb-5">
        <div className="size-15 flex items-center justify-center shrink-0  bg-[#2B7FFF] rounded-full ">
        <i className="fa-solid fa-bell text-3xl"></i>
        </div>

        <div className="">
            <h1 className="text-2xl ">Notifications</h1>
            <p className="text-xs mt-2">Stay updated with activity around your account.</p>    
            <span className="text-[#2B7FFF] text-sm font-bold">{unReadCount} unread notifications</span>
        </div>
        </div>
        <div className="flex flex-col overflow-hidden border col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5  bg-[#252728]  rounded-lg mb-5">
            <div className="relative flex border-b">

                <button onClick={()=>setUnRead(true)} className={`p-2 border-r ${unRead&&'bg-white/10 border-b text-blue-500'} hover:bg-white/10 cursor-pointer`}>All</button>
                <button onClick={()=>setUnRead(false)} className={`p-2 ${!unRead&&'bg-white/10 border-b text-blue-500'} hover:bg-white/10 cursor-pointer`}>Unread</button>

                <button onClick={markAllAsRead} className="absolute top-2.5 right-2 text-sm cursor-pointer text-blue-500 hover:underline" >Mark all as read</button>
                </div>
            {notifications.length>0?notifications.map((notif)=>
            <div disabled={notif.entity?.unavailable} onClick={()=>{
          if ( notif.entityType === 'post'){
            if(notif.entity?.unavailable){
              console.log('unavailable');
            }
            else{
              handleNotify(notif._id,notif.entityId,navigate)
            }
          }
          else if(notif.entityType === 'comment'){
            handleNotify(notif._id,notif.entity.post,navigate)
          }
          else if(notif.entityType === 'user'){
            handleNotify(notif._id,false,navigate)
            navigate(`/profile/${notif.entityId}`)
          }
            
          }} key={notif._id} className={`flex relative gap-2 border-b pt-3 p-5 pb-2  ${notif.entity?.unavailable?'opacity-20 cursor-not-allowed':(notif.isRead?"cursor-pointer hover:bg-white/20! bg-gray-800/10":"bg-gray-900/50 cursor-pointer hover:bg-white/20!")} `}>
            {!notif.isRead&&!notif.entity?.unavailable&&<div className="size-2 rounded-full absolute top-1 right-1 bg-[#2B7FFF]"></div>}
          <img src={notif.actor.photo} className="size-7 shrink-0 rounded-full outline-2 outline-white object-cover" alt="" />
          <div className="flex flex-col">
        {notif.type=='like_post'&&<p className="flex flex-col"><span className="font-bold">{notif.actor.name}</span> <span className="text-xs ps-1">{"Liked Your post"} </span></p>} 
        {notif.type=='comment_post'&&<p className="flex flex-col"><span className="font-bold">{notif.actor.name}</span> <span className="text-xs ps-1">{"Commented on Your post"} </span></p>} 
        {notif.type=='follow_user'&&<p className="flex flex-col"><span className="font-bold">{notif.actor.name}</span> <span className="text-xs ps-1">{notif.entity?.unavailable?"This content is no longer available":"Started following you"} </span> </p>} 
        {notif.type=='share_post'&&<p className="flex flex-col"><span className="font-bold">{notif.actor.name}</span> <span className="text-xs ps-1">{"Shared your post"}</span> </p>} 
         <span className={`text-[10px] text-gray-400 `}>{handleDate(notif.createdAt)}</span>
         <span className={`flex text-[10px]  ${notif.entity?.unavailable?'':(notif.isRead?"text-gray-400":"text-[#2B7FFF]")} items-center mt-1`} >{notif.entity?.unavailable?'Creator has deleted post Unavailable to review':'Tap to view'} {!notif.entity?.unavailable?<ArrowRight className="size-3" />:<X className="size-3"/>}  </span>
          </div>
            </div>
            ):<p className="text-center py-6" >No Notifications to preview</p>}
        </div>

  </div>
  </>
}
