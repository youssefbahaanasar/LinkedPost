
import { ImageIcon, X } from 'lucide-react';
import ProfileHover from '../ProfileHover/ProfileHover';
import handleDate from '@/Helpers/handleDate';
import { AspectRatio } from '../ui/aspect-ratio';
import { useRef, useState } from 'react';
import Cookies from 'js-cookie'
import { Textarea } from '../ui/textarea';
import { Spinner } from '../ui/spinner';
export default function TopComment({replyCommentText,setCommentImageShow,handleReplyCommentImageClick,handleReplyCommentImage,setReplyCommentHasImage,replyCommentHasImage,replyComment,replyCommentImageRef,textComment,commentImageShow,isLoading,setReplyCommentText,setFocus,focus,showReplyBox,imageRef,likeComment,setShowReplyBox,post,getComments,likesHistory}) {
  const [showTopCommentPhoto, setShowTopCommentPhoto] = useState(false)
  const replyTextRef = useRef();
  return <>
  {post.topComment&&<div className="flex gap-1 px-1">
                <div className="w-7 h-7 rounded-full object-cover shrink-0 dark:bg-[#E5E8EB]">
                    <img src= {post.topComment?.commentCreator.photo} className="w-7 h-7 rounded-full object-cover" alt="" />
                </div>
                <div className="flex flex-col">
                <div className=" rounded-lg min-w-25  ">
                  <div className=" ps-1">
                    <div className="flex text-sm">
                <ProfileHover userId={post.topComment.commentCreator._id} name={post.topComment.commentCreator.name} photo={post.topComment.commentCreator.photo} username={post.topComment.commentCreator.username} />
                 <span  className="text-xs ps-1 text-white/60 mt-1 items-start underline-offset-1 font-semibold " > · {handleDate(post.topComment.createdAt)}</span>
                    </div>
                <p className=" ps-1 text-md font-extralight">
                {post.topComment?.content}
                </p>
                  </div>
                <img onClick={()=>{setShowTopCommentPhoto(true); document.body.classList.add('overflow-hidden')}} src={post.topComment.image} alt="" className="max-w-60 rounded-lg" />
                {post.topComment.image&&showTopCommentPhoto&&<AspectRatio onClick={()=>{setShowTopCommentPhoto(false); document.body.classList.remove('overflow-hidden')}} className={`z-999 fixed top-0 bottom-0 left-0 right-0 bg-black/80 flex justify-center `}>
                <img
                    onClick={(e)=>e.stopPropagation()}
                    src={post.topComment.image}
                    ref={imageRef}
                    alt="Photo"
                    fill={`true`}
                    className={`aspect-video object-contain w-3/5  object-center `}
                />
                    <X className="absolute top-10 right-20 size-8 cursor-pointer hover:bg-white/20 bg-white/10 rounded-full p-1"/>
                </AspectRatio>}
                </div>
                <div className="flex gap-2 ps-1">
                   
                    <button onClick={()=>{likeComment(post.topComment._id); }} variant="link" className={`text-[10px] hover:underline p-0 mt-0.5 items-start  underline-offset-1 cursor-pointer ${likesHistory.some(item => item.id==post.topComment._id&&item.likes.includes(Cookies.get('userId')))&&'text-blue-500'} `}> <p>{(likesHistory.find(item=>item.id==post.topComment._id)?.likes.length>0&&likesHistory.find(item=>item.id==post.topComment._id).likes.length)} {likesHistory.some(item=>item.id==post.topComment._id&&item.likes.includes(Cookies.get('userId')))?<i className="fa-solid fa-thumbs-up"></i>:"Like"}</p> </button>
                    <button onClick={()=>setShowReplyBox(post.topComment._id)} variant="link" className="text-[10px] hover:underline p-0 mt-0.5 items-start underline-offset-1 cursor-pointer ">Reply</button>
                </div>
                {showReplyBox==post.topComment._id&&
                    <div className={` relative flex flex-col items-start gap-1.5 min-w-60 w-full py-1.5 `}>
                        
                          <div className="relative grow rounded-3xl  ">
                        <Textarea ref={replyTextRef} onChange={(e)=>{setReplyCommentText(e.target.value)}} onFocus={()=>setFocus(true)}  placeholder={`Reply to ${post.topComment.commentCreator.name} `} className={` break-all min-w-60 min-h-0 max-w-xs scrollbar-thumb-chart-1  max-h-100 rounded-3xl ${(focus&&replyCommentText||replyCommentHasImage)&&`rounded-b-none`} resize-none  border-0 focus-visible:ring-0 `}/>

                        <div className=" w-full rounded-b-3xl flex  bg-[#2E2F30]">
                        {(replyCommentText||replyCommentHasImage)&&<button disabled={(isLoading&&!replyCommentText) || (!textComment&&!replyCommentHasImage)} onClick={()=>replyComment(post.topComment._id)} className={`ms-auto  ${(focus&&replyCommentText)||replyCommentHasImage?'':'absolute bottom-0 right-0'} -translate-y-1/4 -translate-x-1/4 w-6 h-6 text-center ${(!isLoading&&replyCommentText||replyCommentHasImage)&&'cursor-pointer hover:bg-white/10 text-[#0866FF]'}  rounded-full` }>
                        {isLoading&&!replyCommentText? <Spinner className={`size-5`} />:<i className="fa-solid fa-paper-plane text-xs "></i>}
                        </button>}
                                  <div className={`absolute  ${(replyCommentText||replyCommentHasImage)?'right-8 bottom-1.25':'bottom-1.5 right-2'} cursor-pointer rounded-full p-1 bg-inherit  hover:bg-white/10 `}>
                                  <ImageIcon onClick={handleReplyCommentImageClick} className="text-white size-4 " />
                                  <input ref={replyCommentImageRef} onChange={handleReplyCommentImage} className="hidden" type="file" accept="image/*" />
                                  </div>
                        </div>
                          </div>
                          {replyCommentHasImage&&
                          <div className="relative w-fit">
                             <X onClick={()=>{setReplyCommentHasImage(false); setCommentImageShow('');  replyCommentImageRef.current.value=''; }} className="absolute top-0 right-0 bg-black/50 hover:bg-black/40 cursor-pointer rounded-full"/>
                          <img src={commentImageShow} className=" max-w-40 "  alt="" /> 
                        </div>}
                    </div>
                    }
                <button onClick={()=>{getComments(post.id)}} className="text-xs cursor-pointer hover:underline hover:text-blue-400" >view all comments</button>
                </div>
            </div>}
  </>
}
