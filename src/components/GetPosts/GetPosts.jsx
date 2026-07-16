import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CardFooter } from "../ui/card";
import { Heart, ImageIcon, MessageCircleMoreIcon, PencilIcon, ReplyIcon, ShareIcon, Trash2Icon, TrashIcon, X } from "lucide-react";
import ProfileHover from "../ProfileHover/ProfileHover";
import { Textarea } from "../ui/textarea";
import {useEffect, useRef, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import { Spinner } from "../ui/spinner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
export default function GetPosts(props) {    
    const [focus, setFocus] = useState(false)
    const [post , setPost] = useState(props.post)
    const [deletedPost , setDeletedPost] = useState('')
    const [textComment, setTextComment] = useState('  ')
    const [postComments, setPostComments] = useState([])
    const mainTextRef = useRef()
    const subTextRef = useRef()
    const mainCommentImageRef = useRef()
    const subCommentImageRef = useRef()
    const shareRef = useRef()
    const [isLoading, setIsLoading] = useState(false)
    const [likesHistory, setLikesHistory] = useState([]);
    const [gettingComments, setGettingComments] = useState(false)
    const [mainCommentHasImage, setMainCommentHasImage] = useState(false)
    const [subCommentHasImage, setSubCommentHasImage] = useState(false)
    const [commentImage, setCommentImage] = useState('')
    const [postId, setPostId] = useState('');
    const [isOpen, setIsOpen] = useState(false);
 useEffect(()=>{
    let history = [];

    if(post.topComment?.likes.length>0) history.push({id:post.topComment._id, likesCount:post.topComment.likes.length});
     postComments.map((comment)=>{
       console.log(comment.likes.length);
       
       if(comment.likes.length>0) history.push({id:comment._id, likesCount:comment.likes.length});
     })
     setLikesHistory(history);
 },[postComments])
  async function getUpdatedPostDetails() {
    const response= await axios.get(`https://route-posts.routemisr.com/posts/${post.id}`,{
      headers:{
        Token:Cookies.get('userToken')
      }
    })
    setPost(response.data.data.post)
  }
  async function deletePost() {
    try {
      const response = await axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`,{headers:{
        Token:Cookies.get('userToken')
      }})
      console.log(response.data);
      setDeletedPost(post._id)
    } catch (error) {
      console.log(error.response);
      
    }
    

  }
  async function createComment(viewComment) {
    setIsLoading(true);

    try {
        const formData = new FormData();
        formData.append('content',textComment);
        if(viewComment){
          if(subCommentImageRef.current?.files[0])formData.append('image',subCommentImageRef.current?.files[0]);
        }else{
          if(mainCommentImageRef.current?.files[0])formData.append('image',mainCommentImageRef.current?.files[0]);
        }
         await axios.post(`https://route-posts.routemisr.com/posts/${post.id}/comments`,formData,
                {
                    headers:{
                            Token:Cookies.get('userToken')
                            }
                }
        )
    if(viewComment){
      subTextRef.current.value = null
      subCommentImageRef.current.value = null
    }
    else {
      mainTextRef.current.value= null
      mainCommentImageRef.current.value = null
    }
        setTextComment('  ')
    if(viewComment)setSubCommentHasImage(false)
    else setMainCommentHasImage(false)
    setCommentImage('')
    getUpdatedPostDetails();
    } catch (error) {
        console.log(error.response);
        if(viewComment)subTextRef.current.value =textComment;
        else mainTextRef.current.value= textComment;

    }
    setTextComment('  ')
    setIsLoading(false)
    if(viewComment)
    getComments(post.id)
    setFocus(false)
  }
  async function getComments(postId) {
    setGettingComments(true);
    try {
      setPostId(post.id);
      const response = await axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=10`,{headers:{
        Token:Cookies.get('userToken')
      }});      
      setPostComments(response.data.data.comments);
      setGettingComments(false);
      document.body.classList.add('overflow-hidden');
    } catch (error) {
      console.log(error.response);
    }
  }
 async function likePost() {
    try {
      const response = await axios.put(`https://route-posts.routemisr.com/posts/${post.id}/like`,{},{
        headers:{
          "Token":Cookies.get("userToken")
        }
      })
      console.log(response.data);
      getUpdatedPostDetails();
      
    } catch (error) {
      console.log(error.response);
      
    }
  }
 async function likeComment(commentId) {
    try {
      const response = await axios.put(`https://route-posts.routemisr.com/posts/${post.id}/comments/${commentId}/like`,{},{
        headers:{
          "Token":Cookies.get("userToken")
        }
      })
      console.log(response.data);
      let history = likesHistory;
      if(response.data.data.liked){

        setLikesHistory([...history,{id:commentId,likesCount:response.data.data.likesCount}]);
        console.log('dd');
      }else{
        const updatedHistory = history.filter((comment)=>comment.id!=response.data.data.comment._id);
        setLikesHistory(updatedHistory);
      }
      console.log(likesHistory);
      
    } catch (error) {
      console.log(error.response);
    }
  }
 async function replyComment() {
    
  }

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
    else if(weaks>0 && weaks<4)return `${weaks}w`;
    else if(days>0 && days<7)return `${days}d`
    else if(hours>0 && hours<24)return `${hours}h`;
    else if(minutes>0 && minutes<60) return `${minutes}m`;
    else if(seconds>=0 && seconds<60) return "Just now";
    else return `${createdAt.getDate()} ${month} at ${createdAt.getHours().toString().padStart(2,"0")}:${createdAt.getMinutes().toString().padStart(2,"0")}`
  }
  function handleClose(e) {
    e.stopPropagation()
  }
  function parentClose() {
    setPostId('');
    setPostComments([]); 
    document.body.classList.remove('overflow-hidden');
  }
  function handleMainCommentImageClick() {
    mainCommentImageRef.current.click();
  }
  function handleSubCommentImageClick() {
    subCommentImageRef.current.click();
  }

  function handleMainCommentImage(e){
    setMainCommentHasImage(true);
    setCommentImage(URL.createObjectURL(e.target.files[0]))
  }
  function handleSubCommentImage(e){
    setSubCommentHasImage(true);
    setCommentImage(URL.createObjectURL(e.target.files[0]))
  }
console.log(postComments);


  
  return<>
  {deletedPost!=post._id&&<div key={post.user._id} className={`col-span-5 col-start-5 dark:bg-[#252728] rounded-lg`}>
      <div className={`relative`}>
       
       {post.user._id == Cookies.get('userId') &&<DropdownMenu >
      <DropdownMenuTrigger className={`absolute top-2 right-2 cursor-pointer border-0 size-8 rounded-full hover:bg-white/10! `} render={<Button className={`bg-[#252728]! `} variant="outline"><i className="fa-solid fa-ellipsis scale-120"></i></Button>} />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon />
            Share
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="destructive" className={`w-full justify-start bg-inherit! hover:bg-destructive/15!`}><TrashIcon />Delete</Button>}
              />
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this post.
                    <br /> 
                    Are you still want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={()=>deletePost()} variant="destructive">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>}

          <div className="flex justify-start items-center w-full p-2">
            <div className="flex gap-2">
            <div className="bg-[#E5E8EB] w-10 h-10 rounded-full">
              <img className="rounded-full w-10 h-10 object-cover" src={post.user.photo} alt="" />
            </div>
            <div className="flex justify-end flex-col">
              <ProfileHover name={post.user.name} photo={post.user.photo} username={post.user.username} />
              <div className="flex gap-1 dark:text-[#b0b3b8] text-[#65686c]">
                <span className="text-xs">{handleDate(post.createdAt)}</span>
                <span><sup className="font-bold">.</sup></span>
                <span className="text-xs">{post.privacy}</span>
              </div>
            </div>
            </div>
          </div>
          <p className="text-xl p-2">{post.body}</p>

          {post.image&&!post.isShare&&<AspectRatio className="aspect-video bg-muted rounded-b-lg dark:bg-black">
          <img
            src={post.image}
            alt="Photo"
            fill={`true`}
            className="aspect-video w-full  object-cover object-center "
          />
        </AspectRatio>}
        {post.isShare&&
        <div className="bg-[#252728] px-2 w-full">

        <div className={`border rounded-lg`}>
          <div className="flex justify-start items-center w-full p-2">
            <div className="flex gap-2">
            <div className="bg-[#E5E8EB] w-10 h-10 rounded-full">
              <img className="rounded-full w-10 h-10 object-cover" src={post.sharedPost.user.photo} alt="" />
            </div>
            <div className="flex justify-end flex-col">
              <ProfileHover name={post.sharedPost.user.name} photo={post.sharedPost.user.photo} username={post.sharedPost.user.username} />
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
            className="aspect-video w-full rounded-b-lg  object-cover object-center "
          />
        </AspectRatio>}
  
        </div>
        </div>
        }


        <CardFooter className={`border-0 flex-col pb-2 items-start`}>
          <div className="mb-2">
          <Button onClick={()=>{likePost()}} className={`bg-inherit text-white/80 hover:bg-white/10 cursor-pointer rounded-t-none h-10 w-14 `}> <Heart className={`size-5 ${post.likes?.includes(Cookies.get('userId'))?'fill-red-500 stroke-0':'stroke-1'}`}/>  <span className="text-xs" >{post.likesCount} </span> </Button>
          <Button onClick={()=>{getComments(post.id)}} disabled={postId}  className={`bg-inherit text-white/80 hover:bg-white/10 cursor-pointer rounded-t-none h-10 w-14`}> <MessageCircleMoreIcon className="size-5 stroke-1"/> <span className="text-xs" >{post.commentsCount} </span> </Button>
        {!post.isShare&&<Dialog  open={isOpen} onOpenChange={setIsOpen}>
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
            <div className="bg-[#E5E8EB] w-10 h-10 rounded-full">
              <img className="rounded-full w-10 h-10 object-cover" src={post.user.photo} alt="" />
            </div>
            <div className="flex justify-end flex-col">
              <ProfileHover name={post.user.name} photo={post.user.photo} username={post.user.username} />
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
      {post.isShare&&<Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <div className="bg-[#E5E8EB] w-10 h-10 rounded-full">
              <img className="rounded-full w-10 h-10 object-cover" src={post.sharedPost.user.photo} alt="" />
            </div>
            <div className="flex justify-end flex-col">
              <ProfileHover name={post.sharedPost.user.name} photo={post.sharedPost.user.photo} username={post.sharedPost.user.username} />
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
      </Dialog>}
          </div>

          {post.topComment&&
          <div className="flex gap-1 px-1">
              <div className="w-7 h-7 rounded-full object-cover shrink-0 dark:bg-[#E5E8EB]">
                  <img src= {post.topComment?.commentCreator.photo} className="w-7 h-7 rounded-full object-cover" alt="" />
              </div>
              <div className="flex flex-col">
              <div className=" rounded-lg min-w-25  ">
                <div className="ps-1">
              <ProfileHover name={post.topComment.commentCreator.name} photo={post.topComment.commentCreator.photo} username={post.topComment.commentCreator.username} />
               <span  className="text-[10px] ps-1 text-white/60 mt-1 items-start underline-offset-1  " >· {handleDate(post.topComment.createdAt)}</span>
              <p className="text-sm font-light">
              {post.topComment?.content}
              </p>
                </div>
              <img src={post.topComment.image} alt="" className="max-w-xs rounded-lg" />
              </div>
              <div className="flex gap-2 ps-1">
                 
                  <span onClick={()=>{likeComment(post.topComment._id); }} variant="link" className={`text-[10px] hover:underline p-0 mt-0.5 items-start  underline-offset-1 cursor-pointer ${likesHistory.some(item => item.id==post.topComment._id)&&'text-blue-500'} `}> <p>{(likesHistory.find(item=>item.id==post.topComment._id)?.likesCount>0&&likesHistory.find(item=>item.id==post.topComment._id).likesCount)} {likesHistory.some(item=>item.id==post.topComment._id)?<i className="fa-solid fa-thumbs-up"></i>:"Like"}</p> </span>
                  <span onClick={replyComment} variant="link" className="text-[10px] hover:underline p-0 mt-0.5 items-start underline-offset-1 cursor-pointer ">Reply</span>
              </div>
              </div>
          </div>}

        <div className={`flex items-start gap-1.5 w-full p-1.5 `}>
          <div className="shrink-0 bg-[#E5E8EB] w-8 h-8 rounded-full">
              <img className="rounded-full  w-8 h-8 object-cover" src={props.photo} alt="" />
            </div>
            <div className="relative grow rounded-3xl  ">
          <Textarea ref={mainTextRef} onChange={(e)=>{setTextComment(e.target.value)}} onFocus={()=>setFocus(true)}  placeholder='Write a comment...' className={`break-all min-h-0 scrollbar-thumb-chart-1  max-h-100 rounded-3xl ${(focus&&mainTextRef.current?.value||mainCommentHasImage)&&`rounded-b-none`} resize-none  border-0 focus-visible:ring-0 `}/>

          <div className=" w-full rounded-b-3xl flex  bg-[#2E2F30]">
          {(mainTextRef.current?.value||mainCommentHasImage)&&<button disabled={(isLoading&&!subTextRef.current?.value) || (!textComment&&!mainCommentHasImage)} onClick={()=>createComment(false)} className={`ms-auto  ${(focus&&mainTextRef.current?.value)||mainCommentHasImage?'':'absolute bottom-0 right-0'} -translate-y-1/4 -translate-x-1/4 w-6 h-6 text-center ${(!isLoading&&mainTextRef.current?.value||mainCommentHasImage)&&'cursor-pointer hover:bg-white/10 text-[#0866FF]'}  rounded-full` }>
          {isLoading&&!subTextRef.current?.value? <Spinner className={`size-5`} />:<i className="fa-solid fa-paper-plane text-xs "></i>}
          </button>}
                    <div className={`absolute top-1.5 ${mainTextRef.current?.value||mainCommentHasImage?'right-7.5 top-7.5':'right-2'} cursor-pointer rounded-full p-1  hover:bg-white/10 `}>
                    <ImageIcon onClick={handleMainCommentImageClick} className="text-white size-4 " />
                    <input ref={mainCommentImageRef} onChange={handleMainCommentImage} className="hidden" type="file" accept="image/*" />
                    </div>
          </div>
            </div>
        </div>
            {mainCommentHasImage&&<img src={commentImage} className="ms-11 max-w-50" alt="" />}
        </CardFooter>
      </div>
  </div>}
 {deletedPost!=post._id&& postId===post.id&& <div onClick={parentClose} key={post.user.id} className={` ${postId===post.id?'fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center col-span-12 col-start-1 bg-black/40 z-9':'hidden'} rounded-lg`}>
       <div onClick={handleClose} className='relative w-xl dark:bg-[#252728] rounded-lg max-h-180'>
        <div className="sticky top-0 z-101 dark:bg-[#252728] rounded-t-lg w-full flex items-center justify-center py-3 border-b">
           <h2 className="font-semibold"> {post.user.name.split(' ',1)}'s Post</h2>
           <span onClick={parentClose} className="absolute top-2 hover:bg-white/10 rounded-full right-2 p-1 cursor-pointer" > <X/> </span>
        </div>

       <div className=" max-h-150 rounded-lg scrollbar-thin scrollbar-thumb-chart-1 overflow-auto">
        <div className="flex justify-start items-center w-full p-2 pb-1">
          <div className="flex gap-2">
          <div className="bg-[#E5E8EB] w-10 h-10 rounded-full">
            <img className="rounded-full w-10 h-10 object-cover" src={post.user.photo} alt="" />
          </div>
          <div className="flex justify-end flex-col">
            <ProfileHover name={post.user.name} photo={post.user.photo} username={post.user.username} />
            <div className="flex gap-1 dark:text-[#b0b3b8] text-[#65686c]">
              <span className="text-xs">{handleDate(post.createdAt)}</span>
              <span><sup className="font-bold">.</sup></span>
              <span className="text-xs">{post.privacy}</span>
            </div>
          </div>
          </div>
        </div>
         <p className="text-lg ps-2">{post.body}</p>
        
        {post.image&&!post.isShare&&<AspectRatio className="aspect-video bg-muted rounded-b-lg dark:bg-black">
        <img
          src={post.image}
          alt="Photo"
          fill={`true`}
          className="aspect-video w-full  object-cover object-center "
        />
      </AspectRatio>}
      
      {post.isShare&&<div className="bg-[#252728] px-2 w-full">

        <div className={`border rounded-lg`}>
          <div className="flex justify-start items-center w-full p-2 pb-0">
            <div className="flex gap-2">
            <div className="bg-[#E5E8EB] w-10 h-10 rounded-full">
              <img className="rounded-full w-10 h-10 object-cover" src={post.sharedPost.user.photo} alt="" />
            </div>
            <div className="flex justify-end flex-col">
              <ProfileHover name={post.sharedPost.user.name} photo={post.sharedPost.user.photo} username={post.sharedPost.user.username} />
              <div className="flex gap-1 dark:text-[#b0b3b8] text-[#65686c]">
                <span className="text-xs">{handleDate(post.sharedPost.createdAt)}</span>
                <span><sup className="font-bold">.</sup></span>
                <span className="text-xs">{post.sharedPost.privacy}</span>
              </div>
            </div>
            </div>
          </div>
          <p className="text-lg ps-2 pb-1">{post.sharedPost.body}</p>
          {post.sharedPost.image&&<AspectRatio className="aspect-video bg-muted rounded-b-lg dark:bg-black">
          <img
            src={post.sharedPost.image}
            alt="Photo"
            fill={`true`}
            className="aspect-video w-full rounded-b-lg  object-cover object-center "
          />
        </AspectRatio>}
  
        </div>
        </div>
        }
       <CardFooter className={`border-0 flex-col items-start`}>
        <div className="">
        <Button onClick={likePost} className={` bg-inherit text-white/80 hover:bg-white/10 cursor-pointer rounded-t-none h-10 w-14`}> <Heart className={`size-5 ${post.likes?.includes(Cookies.get('userId'))?'fill-red-500 stroke-0':'stroke-1'}`}/> <span className="text-xs" >{post.likesCount} </span> </Button>
        <Button onClick={()=>{getComments(post.id)}} disabled={postId} className={`bg-inherit text-white/80 hover:bg-white/10 cursor-pointer rounded-t-none h-10 w-14`}> <MessageCircleMoreIcon className="size-5 stroke-1"/><span className="text-xs" >{post.commentsCount} </span> </Button>
        {/* <Button className={`bg-inherit text-white/80 hover:bg-white/10 cursor-pointer rounded-t-none h-10 w-14`}> <ReplyIcon className="size-5 rotate-y-180 stroke-1"/>  <span className="text-xs" >{sharesCount} </span> </Button> */}
         {!post.isShare&&<Dialog  open={isOpen} onOpenChange={setIsOpen}>
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
            <div className="bg-[#E5E8EB] w-10 h-10 rounded-full">
              <img className="rounded-full w-10 h-10 object-cover" src={post.user.photo} alt="" />
            </div>
            <div className="flex justify-end flex-col">
              <ProfileHover name={post.user.name} photo={post.user.photo} username={post.user.username} />
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
            className="aspect-video w-full  object-cover object-center "
          />
        </AspectRatio>}
        <CardFooter className={`border-0 flex-col items-start`}>
          <div className="flex mb-2">
          <p  className={`bg-inherit text-white/80 hover:bg-inherit flex items-center justify-center gap-1  rounded-t-none h-10 w-14 `}> <Heart className="size-5 stroke-1"/>  <span className="text-xs" >{post.likesCount} </span> </p>
          <p  className={`bg-inherit text-white/80 hover:bg-inherit flex items-center justify-center gap-1  rounded-t-none h-10 w-14`}> <MessageCircleMoreIcon className="size-5 stroke-1"/> <span className="text-xs" >{post.commentsCount} </span> </p>
          <p className={`bg-inherit text-white/80 hover:bg-inherit flex items-center justify-center gap-1  rounded-t-none h-10 w-14`}> <ReplyIcon className="size-5 rotate-y-180 stroke-1"/> <span className="text-xs" >{post.sharesCount} </span> </p>
          </div>
        </CardFooter>
        </div>

          <DialogFooter className="justify-end">
            <Button onClick={()=>sharePost(post.id)} className={`bg-[#0866FF] hover:bg-[#337aeb] cursor-pointer text-white`} type="button">Share now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>}
         {post.isShare&&<Dialog  open={isOpen} onOpenChange={setIsOpen}>
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
            <div className="bg-[#E5E8EB] w-10 h-10 rounded-full">
              <img className="rounded-full w-10 h-10 object-cover" src={post.sharedPost.user.photo} alt="" />
            </div>
            <div className="flex justify-end flex-col">
              <ProfileHover name={post.sharedPost.user.name} photo={post.sharedPost.user.photo} username={post.sharedPost.user.username} />
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
      </Dialog>}
        </div>

        {!gettingComments&&!isLoading?(postComments.length!=0?postComments.map((comment,index)=>(
         <div key={index} className="flex px-1 mb-3">
            <div className="w-9 h-9 rounded-full flex  shrink-0 object-cover dark:bg-[#E5E8EB]">
                <img src= {comment.commentCreator.photo} className="w-9 h-9 rounded-full object-cover" alt="" />
            </div>
            <div className="flex flex-col">
            <div className=" rounded-lg min-w-25 ">
            <div className="ps-1">
            <ProfileHover name={comment.commentCreator.name} photo={comment.commentCreator.photo} username={comment.commentCreator.username} />
             <span  className="text-[10px] ps-1 text-white/60 mt-1 items-start underline-offset-1  " >· {handleDate(comment.createdAt)}</span>
            <p className="text-sm font-light">
            {comment.content}
            </p>
            </div>

            <img src={comment.image} alt="" className="max-w-xs rounded-lg" />
            </div>
            <div className="flex gap-2 ps-1">
               
                <span onClick={()=>{likeComment(comment._id); }} variant="link" className={`text-[10px] hover:underline p-0 mt-1 items-start underline-offset-1 cursor-pointer ${likesHistory.some(item => item.id==comment._id)&&'text-blue-500'} `}> <p>{(likesHistory.find(item=>item.id==comment._id)?.likesCount>0&&likesHistory.find(item=>item.id==comment._id).likesCount)} {likesHistory.some(item=> item.id==comment._id)?<i className="fa-solid fa-thumbs-up"></i>:'Like'} </p> </span>
                <span onClick={replyComment} variant="link" className="text-[10px] hover:underline p-0 mt-1 items-start underline-offset-1 cursor-pointer "> Reply</span>
            </div>
            </div>
        </div>
        )):
        <div className="flex flex-col justify-center items-center w-full">
          <h3 className="font-semibold text-lg" >No comments yet</h3>
          <p className="font-extralight -mt-1" >Be the first to comment!</p>
        </div>
      ):<div className="flex flex-col gap-8 px-2">
      <div className="flex w-fit items-start gap-4 ">
      <Skeleton className="size-7 dark:bg-gray-300/20 shrink-0 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="dark:bg-gray-300/20 h-3 w-37.5" />
        <Skeleton className="dark:bg-gray-300/20 h-3 w-25" />
      </div>
    </div>
      <div className="flex w-fit items-start gap-4 ">
      <Skeleton className="size-7 dark:bg-gray-300/20 shrink-0 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="dark:bg-gray-300/20 h-3 w-37.5" />
        <Skeleton className="dark:bg-gray-300/20 h-3 w-25" />
      </div>
    </div>
      </div>
        
        }

       </CardFooter>
       </div>
       
       <div className={` relative flex items-start gap-1.5 w-full p-1.5 `}>
          <div className="shrink-0 bg-[#E5E8EB] w-8 h-8 rounded-full">
              <img className="rounded-full  w-8 h-8 object-cover" src={props.photo} alt="" />
            </div>
            <div className="relative grow rounded-3xl  ">
          <Textarea ref={subTextRef} onChange={(e)=>{setTextComment(e.target.value)}} onFocus={()=>setFocus(true)}  placeholder='Write a comment...' className={`break-all min-h-0 scrollbar-thumb-chart-1  max-h-100 rounded-3xl ${(focus&&subTextRef.current?.value||subCommentHasImage)&&`rounded-b-none`} resize-none  border-0 focus-visible:ring-0 `}/>

          <div className=" w-full rounded-b-3xl flex  bg-[#2E2F30]">
          {(subTextRef.current?.value||subCommentHasImage)&&<button disabled={(isLoading&&!subTextRef.current?.value) || (!textComment&&!subCommentHasImage)} onClick={()=>createComment(true)} className={`ms-auto  ${(focus&&subTextRef.current?.value)||subCommentHasImage?'':'absolute bottom-0 right-0'} -translate-y-1/4 -translate-x-1/4 w-6 h-6 text-center ${(!isLoading&&subTextRef.current?.value||subCommentHasImage)&&'cursor-pointer hover:bg-white/10 text-[#0866FF]'}  rounded-full` }>
          {isLoading&&!subTextRef.current?.value? <Spinner className={`size-5`} />:<i className="fa-solid fa-paper-plane text-xs "></i>}
          </button>}
                    <div className={`absolute top-1.5 ${subTextRef.current?.value||subCommentHasImage?'right-7.5 top-7.5':'right-2'} cursor-pointer rounded-full p-1  hover:bg-white/10 `}>
                    <ImageIcon onClick={handleSubCommentImageClick} className="text-white size-4 " />
                    <input ref={subCommentImageRef} onChange={handleSubCommentImage} className="hidden" type="file" accept="image/*" />
                    </div>
          </div>
            </div>
            {subCommentHasImage&&
            <div className="absolute w-fit pt-2 pr-2 bg-white/20  bottom-1/1">
             <img src={commentImage} className=" max-w-40  rounded-lg "  alt="" /> 
            </div>}
        </div>
        
        
       </div>
      </div>}
  </>
}
