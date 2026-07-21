import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ArrowRight, Bell } from 'lucide-react';
import handleDate from '@/Helpers/handleDate';
import Cookies from 'js-cookie'
export default function NotificationsIcon({notifications,notificationsCount}) {
    const navigate = useNavigate();


    async function handleNotify(notifID,entityId){
    await axios.patch(`https://route-posts.routemisr.com/notifications/${notifID}/read`,{},{headers:{Token:Cookies.get("userToken")}});
   if(entityId){
     navigate(`/post/${entityId}`);
   }
    }
  return <>
  <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="link" className={`relative  flex cursor-pointer rounded-full size-10 bg-white/10 hover:bg-white/20`}>
      {notificationsCount>0&&<span className="absolute top-0 -right-1 size-4 bg-red-700 text-[10px] flex justify-center items-center rounded-full">
            {notificationsCount}
      </span>}
      <Bell className="size-5 stroke-white fill-white" fill="true" />
      </Button>} />
      <DropdownMenuContent className={`max-h-100 translate-x-15 w-80 md:w-xs rounded-4xl overflow-hidden p-0 dark:bg-[#1C1C1D] `} >
        <h2 className="text-lg font-bold text-center py-4 border-b ">Notifications</h2>
      <DropdownMenuGroup className={`overflow-auto flex flex-col gap-2 max-h-80 p-1 scrollbar-thin scrollbar-thumb-chart-1 dark:bg-[#252728]`}>
        {notifications.map((notif)=>(
        <DropdownMenuItem disabled={notif.entity?.unavailable} onClick={()=>{
          if ( notif.entityType === 'post'){
            if(notif.entity?.unavailable){
              console.log('unavailable');
            }
            else{
              handleNotify(notif._id,notif.entityId)
            }
          }
          else if(notif.entityType === 'comment'){
            handleNotify(notif._id,notif.entity.post)
          }
          else if(notif.entityType === 'user'){
            handleNotify(notif._id,false)
            navigate(`/profile/${notif.entityId}`)
          }
            
          }} key={notif._id} className={`flex justify-start items-start gap-3 ${notif.entity?.unavailable?'':(notif.isRead?"":"bg-white/10! ")} hover:bg-white/20!`}>
          {!notif.isRead&&!notif.entity?.unavailable&&<div className="size-2 rounded-full absolute top-1 right-1 bg-[#2B7FFF]"></div>}
          <img src={notif.actor.photo} className="size-7 shrink-0 rounded-full outline-2 outline-white object-cover" alt="" />
          <div className="flex flex-col">
        {notif.type=='like_post'&&<p className="flex flex-col"><span className="font-bold">{notif.actor.name}</span> <span className="text-xs ps-1">{notif.entity?.unavailable?"This content is no longer available":"Liked Your post"} </span></p>} 
        {notif.type=='comment_post'&&<p className="flex flex-col"><span className="font-bold">{notif.actor.name}</span> <span className="text-xs ps-1">{notif.entity?.unavailable?"This content is no longer available":"Commented on Your post"} </span></p>} 
        {notif.type=='follow_user'&&<p className="flex flex-col"><span className="font-bold">{notif.actor.name}</span> <span className="text-xs ps-1">{notif.entity?.unavailable?"This content is no longer available":"Started following you"} </span> </p>} 
        {notif.type=='share_post'&&<p className="flex flex-col"><span className="font-bold">{notif.actor.name}</span> <span className="text-xs ps-1">{notif.entity?.unavailable?"This content is no longer available":"Shared your post"}</span> </p>} 
         <span className={`text-[10px] text-gray-400 `}>{handleDate(notif.createdAt)}</span>
         <span className={`flex text-[10px]  ${notif.entity?.unavailable?'':(notif.isRead?"text-gray-400":"text-[#2B7FFF]")} items-center mt-1`} >{notif.entity?.unavailable?'Unavailable':'Tap to view'} {!notif.entity?.unavailable&&<ArrowRight className="size-3" />}  </span>
          </div>
        </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
        
      </DropdownMenuContent>
    </DropdownMenu>
  </>
}
