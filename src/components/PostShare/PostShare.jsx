import { ReplyIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import ProfileHover from "../ProfileHover/ProfileHover";
import handleDate from "@/Helpers/handleDate";
import { AspectRatio } from "../ui/aspect-ratio";

import axios from "axios";
import Cookies from 'js-cookie'


export default function PostShare({shareRef,getUpdatedPostDetails,isOpen,setIsOpen,post}) {


async function sharePost(postId) {
  try {
    const response = await axios.post(`https://route-posts.routemisr.com/posts/${postId}/share`,{
      'body':shareRef.current.value||' '
    },{
      headers:{
        Token:Cookies.get('userToken'),
        "Content-Type":"application/json"
      }
    })
    console.log(response.data);
    getUpdatedPostDetails();
    setIsOpen(false);
  } catch (error) {
    console.log(error.response);
    
  }
  
 }
 
  return <>
  {post.isShare?<Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger render={<Button className={`bg-inherit text-white/80 hover:bg-white/10 cursor-pointer rounded-t-none h-10 w-14`}> <ReplyIcon className="size-5 rotate-y-180 stroke-1"/> <span className="text-xs" >{post.sharesCount} </span> </Button>} />
              <DialogContent className="bg-[#252728] sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className={`text-center border-b pb-2`} >Sharing {post.sharedPost.user.name.split(' ',1)}'s Post</DialogTitle>
                  <DialogDescription>
                    <Textarea ref={shareRef} placeholder='Say something about this post....' className={`text-white bg-[#252728]! min-h-0 resize-none max-h-50 scrollbar-thumb-chart-1 text-md break-all border-0 focus-visible:ring-0`} />
                  </DialogDescription>
                </DialogHeader>
      
              <div className={`border rounded-lg`}>
                <div className="flex justify-start items-center w-full p-2">
                  <div className="flex gap-2">
                  <div className="bg-[#E5E8EB] size-10 shrink-0 rounded-full">
                    <img className="rounded-full size-10 object-cover" src={post.sharedPost.user.photo} alt="" />
                  </div>
                  <div className="flex justify-end flex-col">
                    <ProfileHover userId={post.sharedPost.user._id} name={post.sharedPost.user.name} photo={post.sharedPost.user.photo} username={post.sharedPost.user.username} />
                    <div className="flex gap-1 dark:text-[#b0b3b8] text-[#65686c]">
                      <span className="text-xs">{handleDate(post.sharedPost.createdAt)}</span>
                      <span><sup className="font-bold">.</sup></span>
                      <span className="text-xs">{post.sharedPost.privacy}</span>
                    </div>
                  </div>
                  </div>
                </div>
                <p className="text-xl p-2">{post.sharedPost.body}</p>
                {post.sharedPost.image&&<AspectRatio className="aspect-video bg-muted rounded-b-lg dark:bg-black">
                <img
                  src={post.sharedPost.image}
                  alt="Photo"
                  fill={`true`}
                  className="aspect-video w-full rounded-b-lg object-cover object-center "
                />
              </AspectRatio>}
              </div>
                <DialogFooter className="justify-end">
                  <Button onClick={()=>sharePost(post.sharedPost.id)} className={`bg-[#0866FF] hover:bg-[#337aeb] cursor-pointer text-white`} type="button">Share now</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>:<Dialog  open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger render={<Button className={`bg-inherit text-white/80 hover:bg-white/10 cursor-pointer rounded-t-none h-10 w-14`}> <ReplyIcon className="size-5 rotate-y-180 stroke-1"/> <span className="text-xs" >{post.sharesCount} </span> </Button>} />
        <DialogContent className="bg-[#252728] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className={`text-center border-b pb-2`} >Sharing {post.user.name.split(' ',1)}'s Post</DialogTitle>
            <DialogDescription>
              <Textarea ref={shareRef} placeholder='Say something about this post....' className={`text-white bg-[#252728]! min-h-0 resize-none max-h-50 scrollbar-thumb-chart-1 text-md break-all border-0 focus-visible:ring-0`} />
            </DialogDescription>
          </DialogHeader>

        <div className={`border rounded-lg`}>
          <div className="flex justify-start items-center w-full p-2">
            <div className="flex gap-2">
            <div className="bg-[#E5E8EB] size-10 shrink-0 rounded-full">
              <img className="rounded-full size-10 object-cover" src={post.user.photo} alt="" />
            </div>
            <div className="flex justify-end flex-col">
              <ProfileHover userId={post.user._id} name={post.user.name} photo={post.user.photo} username={post.user.username} />
              <div className="flex gap-1 dark:text-[#b0b3b8] text-[#65686c]">
                <span className="text-xs">{handleDate(post.createdAt)}</span>
                <span><sup className="font-bold">.</sup></span>
                <span className="text-xs">{post.privacy}</span>
              </div>
            </div>
            </div>
          </div>
          <p className="text-xl p-2">{post.body}</p>
          {post.image&&<AspectRatio className="aspect-video bg-muted rounded-b-lg dark:bg-black">
          <img
            src={post.image}
            alt="Photo"
            fill={`true`}
            className="aspect-video w-full rounded-b-lg object-cover object-center "
          />
        </AspectRatio>}
 
        </div>
          <DialogFooter className="justify-end">
            <Button onClick={()=>sharePost(post.id)} className={`bg-[#0866FF] hover:bg-[#337aeb] cursor-pointer text-white`} type="button">Share now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>}
      
      
  </>
}
