
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import GetPosts from '@/components/GetPosts/GetPosts';

export default function Post() {
    const {id} = useParams();
    const [post, setPost] = useState('')
    const [photo, setPhoto] = useState('')
    useEffect(()=>{
      async function getPost() {
        try {
          const [postResponse,profileResponse] = await Promise.all([
                axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
                headers:{
                  'Token':Cookies.get('userToken')
                }}),
                axios.get("https://route-posts.routemisr.com/users/profile-data", {
                    headers: {
                      Token: Cookies.get("userToken"),
                    },
                  }),
            ]) 
            setPost(postResponse.data.data.post)
            setPhoto(profileResponse.data.data.user.photo)
          
        } catch (error) {
          console.log(error.response);
        }
      }
      getPost();
    },[id])

    
  return <div className='py-20'>
    <div  className="grid grid-cols-13 gap-2">
    {photo&&<GetPosts post={post} photo={photo} />}
    </div>
  </div>
}
