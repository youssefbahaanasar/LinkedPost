import axios from "axios";
import Cookies from 'js-cookie'

  export default async function handleNotify(notifID,entityId,navigate){
    await axios.patch(`https://route-posts.routemisr.com/notifications/${notifID}/read`,{},{headers:{Token:Cookies.get("userToken")}});
   if(entityId){
     navigate(`/post/${entityId}`);

   }
  }