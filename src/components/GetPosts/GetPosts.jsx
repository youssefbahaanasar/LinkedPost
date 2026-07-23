/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CardFooter } from "../ui/card";
import { Bookmark, ChevronDown, ChevronUp, Edit, Heart, ImageIcon, ImagePlusIcon, MessageCircleMoreIcon, PencilIcon, Trash2Icon, TrashIcon, X } from "lucide-react";
import ProfileHover from "../ProfileHover/ProfileHover";
import { Textarea } from "../ui/textarea";
import {useEffect, useRef, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import { Spinner } from "../ui/spinner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Field, FieldGroup } from "../ui/field";
import PostShare from "../PostShare/PostShare";
import TopComment from "../TopComment/TopComment";


export default function GetPosts(props) {   
    const mainTextRef = useRef(null)
    const subTextRef = useRef(null)
    const replyTextRef = useRef(null)
    const imageRef = useRef(null);
    const editImageRef = useRef(null);
    const mainCommentImageRef = useRef(null)
    const subCommentImageRef = useRef(null)
    const replyCommentImageRef = useRef(null)
    const shareRef = useRef(null) 
    const [focus, setFocus] = useState(false)
    const [post , setPost] = useState(props.post)
    const [showPostPhoto , setShowPostPhoto] = useState(false)
    const [showCommentPhoto , setShowCommentPhoto] = useState(false)
    const [bookmarked , setBookmarked] = useState(post.bookmarked)
    const [loadingBookmark , setLoadingBookmark] = useState(false)
    const [deletedPost , setDeletedPost] = useState('')
    const [textComment, setTextComment] = useState('  ')
    const [replyCommentText, setReplyCommentText] = useState('  ')
    const [postComments, setPostComments] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [likesHistory, setLikesHistory] = useState([]);
    const [repliesLikesHistory, setRepliesLikesHistory] = useState([]);
    const [gettingComments, setGettingComments] = useState(false)
    const [mainCommentHasImage, setMainCommentHasImage] = useState(false)
    const [subCommentHasImage, setSubCommentHasImage] = useState(false)
    const [replyCommentHasImage, setReplyCommentHasImage] = useState(false)
    const [commentImage, setCommentImage] = useState('')
    const [commentImageShow, setCommentImageShow] = useState('')
    const [postId, setPostId] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const dialog = useRef();
    const [editText,setEditText] = useState();
    const [editPhoto,setEditPhoto] = useState();
    const [replies,setReplies] = useState([]);
    const [hasImage,setHasImage] = useState(false);
    const [repliesShowed,setRepliesShowed] = useState('');


 useEffect(()=>{
    let history = [];
    const updatedHistory = [];

    if(post.topComment?.likes.length>0) history.push({id:post.topComment._id, likes:post.topComment.likes});
    if(postComments.length>0){
      const allComments=postComments.filter((comment)=>comment.likes.length>0)
      allComments.map((comment)=>{updatedHistory.push({id:comment._id, likes:comment.likes})})
      setLikesHistory(updatedHistory);
    }else{
      setLikesHistory(history);
    }
 },[postComments])
useEffect(()=>{
  return () => {
      document.body.classList.remove('overflow-hidden')
      setShowPostPhoto(false)   
    };
},[])
 async function handleBookmark(postId) {
  try {
    setLoadingBookmark('true')
    const response = await axios.put(`https://route-posts.routemisr.com/posts/${postId}/bookmark`,{},{
      headers:{Token:Cookies.get('userToken')}
    })
    console.log(response.data);
    setBookmarked(response.data.data.bookmarked);
  } catch (error) {
    console.log(error.response);
  }
  setLoadingBookmark(false)
 }
 async function getCommentReplies(commentId) {
  if(repliesShowed==commentId){ setReplies([]); setRepliesShowed('');}
  else{
        const response = await axios.get(`https://route-posts.routemisr.com/posts/${post._id}/comments/${commentId}/replies?page=1&limit=10`,{
          headers:{Token:Cookies.get('userToken')}
        })
        const history = [];
        setReplies(response.data.data.replies)
        response.data.data.replies.map((reply)=>{
          if(reply.likesCount>0)history.push({id:reply._id, likes:reply.likes})
        })
        setRepliesLikesHistory(history);
        setRepliesShowed(commentId)
    }
 }
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
    document.body.classList.add('overflow-hidden');
    try {
      setPostId(post.id);
      const response = await axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=10`,{headers:{
        Token:Cookies.get('userToken')
      }});      
      setPostComments(response.data.data.comments);
      setGettingComments(false);
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
      let history = likesHistory.filter((comment)=>comment.id!=commentId);
      if(response.data.data.liked){
        setLikesHistory([...history,{id:commentId,likes:response.data.data.comment.likes}]);
      }else{
        setLikesHistory([...history]);
      }
      
    } catch (error) {
      console.log(error.response);
    }
  }
 async function likeReplyComment(replyId) {
    try {
      const response = await axios.put(`https://route-posts.routemisr.com/posts/${post.id}/comments/${replyId}/like`,{},{
        headers:{
          "Token":Cookies.get("userToken")
        }
      })
      console.log(response.data);
      let history = repliesLikesHistory.filter((item)=>item.id!=replyId);
      setRepliesLikesHistory([...history,{id:replyId,likes:response.data.data.comment.likes}]);
      

      
    } catch (error) {
      console.log(error.response);
    }
  }
 async function replyComment(commentId) {
  try {
    setIsLoading(true)
    const formData = new FormData();
    formData.append('content',replyCommentText)
    if(replyCommentImageRef.current?.files[0])formData.append('image',replyCommentImageRef.current.files[0]);
    const response = await axios.post(`https://route-posts.routemisr.com/posts/${post._id}/comments/${commentId}/replies`,formData,{
      headers:{Token:Cookies.get('userToken')}
    })
    console.log(response.data);
  } catch (error) {
    console.log(error.response);
  }
      setReplyCommentText('  ')
      setCommentImage('')
      setCommentImageShow('')
      setReplyCommentHasImage(false)
      setIsLoading(false)
      setShowReplyBox(false)
      getCommentReplies(commentId)
  }

 async function updatePost() {
  try {
    setIsLoading(true)
    const formData = new FormData();
    formData.append('body',editText)
    if(hasImage){
      const image = editImageRef.current?.files?.[0];
      if(image)
      formData.append('image',image)
      }
    const response = await axios.put(`https://route-posts.routemisr.com/posts/${post.id}`,formData,{headers:{Token:Cookies.get('userToken')}})
    console.log(response.data);
    setDialogOpen(false)
    getUpdatedPostDetails()
  } catch (error) {
    console.log(error.response);
    
  }
  setIsLoading(false);
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
    setReplyCommentHasImage(false)
    setCommentImage('')
    setReplies([]); 
    setRepliesShowed('');
    setShowReplyBox(false)
    document.body.classList.remove('overflow-hidden');
  }
  
  function handleMainCommentImageClick() {
    mainCommentImageRef.current.click();
  }
  function handleSubCommentImageClick() {
    subCommentImageRef.current.click();
  }
  function handleReplyCommentImageClick() {
    replyCommentImageRef.current.click();
  }

  function handleMainCommentImage(e){
    setMainCommentHasImage(true);
    setCommentImage(URL.createObjectURL(e.target.files[0]))
  }
  
  function handleSubCommentImage(e){
    setSubCommentHasImage(true);
    setCommentImage(URL.createObjectURL(e.target.files[0]))
  }
  function handleReplyCommentImage(e){
    setReplyCommentHasImage(true);
    setCommentImageShow(URL.createObjectURL(e.target.files[0]))
    setCommentImage(e.target.files[0])
  }
  function clickInputImage(){
    editImageRef.current.click();
  }
  function handleImage(){
    const image = editImageRef.current?.files[0];
    if(image){
      const photo = URL.createObjectURL(image)
      setHasImage(true);
      setEditPhoto(photo)
    }
  }
  
  return<>
{/* Post */}
  {deletedPost!=post._id&&<div key={post.user._id} className={`col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5 dark:bg-[#252728] rounded-lg`}>
      <div className={`relative`}>

  
{/* Edit dialog */}
       <Dialog open={dialogOpen} onOpenChange={(open)=>{
              if(open){
                setDialogOpen(true);
                setEditPhoto(post?.image)
                setEditText(post.body)
              if (post?.image)
                setHasImage(true)
            }
            else{
                setHasImage(false)
                setDialogOpen(false)
                setHasImage(false)
              }
            }}>
              <DialogTrigger
                render={
                  <Button ref={dialog} className="hidden w-fit  text-md font-light cursor-pointer text-white hover:bg-white/7 justify-start bg-inherit ">
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-md bg-[#252728]">
                {isLoading&&<div className="absolute bg-white/20 flex items-center justify-center h-full w-full rounded-lg ">
                <Spinner className={`size-10`} />
                </div> }
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  ref={editImageRef}
                  onChange={handleImage}
                />
                <DialogHeader>
                  <DialogTitle
                    className={`flex justify-center text-lg border-b pb-2`}
                  >
                    Edit Post
                  </DialogTitle>
                  <div className={`flex gap-2`}>
                    <div className="w-10 h-10 rounded-full dark:bg-[#E5E8EB]">
                      <img
                        src={post.user.photo}
                        className="w-10 h-10 rounded-full object-cover"
                        alt=""
                      />
                    </div>
                    <h2 className="text-white">{post.user.name}</h2>
                  </div>
                </DialogHeader>
                <FieldGroup className={`items-start gap-5`}>
                  <Field>
                    <Textarea
                      id={`bodyText`}
                      className={`${hasImage&&dialogOpen?'h-10':"h-30"} placeholder:text-2xl text-2xl!}   dark:bg-[#252728] resize-none border-0 outline-0 focus-visible:ring-0`}
                      name="post"
                      placeholder="What's on your mind?"
                      value={editText}
                      onChange={(e)=>setEditText(e.target.value)}
                    />
                  </Field>
                  {!hasImage&&<Field
                  onClick={clickInputImage}
                    className={`w-fit rounded-full p-2 cursor-pointer hover:bg-white/20`}
                  >
                    <ImagePlusIcon />
                  </Field>}
                  {hasImage&&editPhoto&&<Field className={`w-full relative rounded-lg border`}>
                     <img className="w-full rounded-lg object-cover" src={editPhoto} alt="" /> 
                      <div onClick={clickInputImage} className={`absolute top-0 w-fit! rounded-full p-2 cursor-pointer bg-black/40 hover:bg-black/60`}>
                    <Edit />
                  </div>
                  </Field>}
                </FieldGroup>
                <DialogFooter>
                  <Button onClick={updatePost} className={`w-full bg-[#0866FF] text-white py-4`}>
                    Post
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>


{/* ... edit , save and delete */}
       {<DropdownMenu >
      <DropdownMenuTrigger className={`absolute top-2 right-2 cursor-pointer border-0 size-8 rounded-full hover:bg-white/10! `} render={<Button className={`bg-[#252728]! `} variant="outline"><i className="fa-solid fa-ellipsis scale-120"></i></Button>} />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {post.user._id == Cookies.get('userId') &&<DropdownMenuItem onClick={()=>dialog.current.click()} >
            <PencilIcon />
                      Edit
          </DropdownMenuItem>}
          <Button className="flex items-center bg-inherit text-white w-full hover:bg-white/8 justify-start gap-2 p-0.5 cursor-pointer" onClick={()=>handleBookmark(post._id)}>
            {loadingBookmark?<Spinner className={`animate-spin`}/>:<i className={`${bookmarked?"fa-solid":"fa-regular"} fa-bookmark`}></i>}
            {bookmarked?"Saved":"Save"}
          </Button>
        </DropdownMenuGroup>
        {post.user._id == Cookies.get('userId') &&<DropdownMenuSeparator />}
        {post.user._id == Cookies.get('userId') &&<DropdownMenuGroup>
          
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

          
        </DropdownMenuGroup>}
      </DropdownMenuContent>
    </DropdownMenu>}
        {/* Save Bookmark */}
    {/* <div onClick={()=>handleBookmark(post._id)} className={` absolute flex items-center justify-center top-2 ${post.user._id == Cookies.get('userId')?'hidden':''} right-2 cursor-pointer border-0 size-8 rounded-full hover:bg-white/10! `}>
    {loadingBookmark?<Spinner className={`animate-spin`}/>:<i className={`${bookmarked?"fa-solid":"fa-regular"} fa-bookmark`}></i>}
    </div> */}


{/* Post Header (Info) */}
          <div className="flex justify-start items-center w-full p-2 ">
            <div className="flex gap-2">
            <div className="bg-[#E5E8EB] size-10 shrink-0 rounded-full">
              <img className="rounded-full size-10 shrink-0 object-cover" src={post.user.photo} alt="" />
            </div>
            <div className="flex container relative justify-end flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center">
              <ProfileHover userId={post.user._id} name={post.user.name} photo={post.user.photo} username={post.user.username} />
              {(post.body=='updated profile picture.'||post.body=='updated cover photo.')&&<span className="text-sm text-white/60 -mt-1 mb-1 sm:m-0 sm:ps-1">{post.body}</span>}
            </div>
              <div className="flex gap-1  dark:text-[#b0b3b8] text-[#65686c]">
                <span className="text-xs">{handleDate(post.createdAt)}</span>
                <span className="font-bold"><sup >·</sup></span>
                <span className="text-xs">{post.privacy}</span>
              </div>
                {post.bookmarked&&
            <div className="flex -bottom-1 left-18 rounded-md px-1 absolute bg-[#0066ff56]  items-center gap-0.5  mb-2  justify-center w-fit text-xs">
              <span className=" py-1 px-0.5  rounded-sm "> <Bookmark fill="white" className="size-3"/> </span> Saved
            </div>
            }
            </div>
            </div>
          </div>


{/* Post body - Regular (Content) */}
          {(post.body!='updated profile picture.'&&post.body!='updated cover photo.')&&<p className="text-xl p-2 pt-0">{post.body}</p>}
          {post.image&&!post.isShare&&<AspectRatio onClick={()=>{setShowPostPhoto(!showPostPhoto);document.body.classList.toggle('overflow-hidden')}} className={`dark:bg-black aspect-video rounded-b-lg `}>
          <img
            src={post.image}
            ref={imageRef}
            alt="Photo"
            fill={`true`}
            className={`aspect-video object-cover w-full  object-center `}
          />
        </AspectRatio>}
          {post.image&&!post.isShare&&showPostPhoto&&<AspectRatio onClick={()=>{setShowPostPhoto(!showPostPhoto);document.body.classList.toggle('overflow-hidden')}} className={`z-99 fixed top-0 bottom-0 left-0 right-0 bg-black/80 flex justify-center `}>
          <img
            onClick={(e)=>e.stopPropagation()}
            src={post.image}
            ref={imageRef}
            alt="Photo"
            fill={`true`}
            className={`aspect-video object-contain w-3/5  object-center `}
          >
            
          </img>
            <X className="absolute top-10 right-20 size-8 cursor-pointer hover:bg-white/20 bg-white/10 rounded-full p-1"/>
        </AspectRatio>}


{/* Post body - Shared (Content) */}
        {post.isShare&&
        <div className="bg-[#252728] px-2 w-full">

        <div className={`border rounded-lg`}>
          <div className="flex justify-start items-center w-full p-2">
            <div className="flex gap-2">
            <div className="bg-[#E5E8EB] w-10 h-10 rounded-full">
              <img className="rounded-full w-10 h-10 object-cover" src={post.sharedPost.user.photo} alt="" />
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

         {post.sharedPost.image&&<AspectRatio onClick={()=>{setShowPostPhoto(!showPostPhoto);document.body.classList.toggle('overflow-hidden')}} className={`dark:bg-black aspect-video rounded-b-lg `}>
          <img
            src={post.sharedPost.image}
            ref={imageRef}
            alt="Photo"
            fill={`true`}
            className={`aspect-video object-cover w-full  object-center `}
          />
        </AspectRatio>}
          {post.sharedPost.image&&showPostPhoto&&<AspectRatio onClick={()=>{setShowPostPhoto(!showPostPhoto);document.body.classList.toggle('overflow-hidden')}} className={`z-99 fixed top-0 bottom-0 left-0 right-0 bg-black/80 flex justify-center `}>
          <img
            onClick={(e)=>e.stopPropagation()}
            src={post.sharedPost.image}
            ref={imageRef}
            alt="Photo"
            fill={`true`}
            className={`aspect-video object-contain w-3/5  object-center `}
          />
            <X className="absolute top-10 right-20 size-8 cursor-pointer hover:bg-white/20 bg-white/10 rounded-full p-1"/>
        </AspectRatio>}
  
        </div>
        </div>
        }


{/* Post Actions (Like, Comments and Share) */}
        <CardFooter className={`border-0 flex-col pb-2 items-start`}>
          <div className="mb-2">
          <Button onClick={()=>{likePost()}} className={`bg-inherit text-white/80 hover:bg-white/10 cursor-pointer rounded-t-none h-10 w-14 `}> <Heart className={`size-5 ${post.likes?.includes(Cookies.get('userId'))?'fill-red-500 stroke-0':'stroke-1'}`}/>  <span className="text-xs" >{post.likesCount} </span> </Button>
          <Button onClick={()=>{getComments(post.id)}} disabled={postId}  className={`bg-inherit text-white/80 hover:bg-white/10 cursor-pointer rounded-t-none h-10 w-14`}> <MessageCircleMoreIcon className="size-5 stroke-1"/> <span className="text-xs" >{post.commentsCount} </span> </Button>


{/* Share Post Action */}
        <PostShare shareRef={shareRef} getUpdatedPostDetails={getUpdatedPostDetails} post={post} isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>


{/* Showing Top Comment */}
          <TopComment commentImageShow={commentImageShow} handleReplyCommentImage={handleReplyCommentImage} isLoading={isLoading} replyCommentHasImage={replyCommentHasImage} replyCommentImageRef={replyCommentImageRef} setCommentImageShow={setCommentImageShow} setFocus={setFocus} setReplyCommentHasImage={setReplyCommentHasImage} setReplyCommentText={setReplyCommentText} textComment={textComment} handleReplyCommentImageClick={handleReplyCommentImageClick} focus={focus} showReplyBox={showReplyBox} setShowReplyBox={setShowReplyBox} imageRef={imageRef} getComments={getComments} likeComment={likeComment} likesHistory={likesHistory} post={post} replyComment={replyComment}/>


{/* Write Comment Filed */}
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
                    <div className={`absolute  ${mainTextRef.current?.value||mainCommentHasImage?'right-8 bottom-1.5':'bottom-1.5 right-2'} cursor-pointer rounded-full p-1  hover:bg-white/10 `}>
                    <ImageIcon onClick={handleMainCommentImageClick} className="text-white size-4 " />
                    <input ref={mainCommentImageRef} onChange={handleMainCommentImage} className="hidden" type="file" accept="image/*" />
                    </div>
          </div>
            </div>
        </div>
            {mainCommentHasImage&&<div className="relative ms-11">
              <X onClick={()=>{setMainCommentHasImage(false); setCommentImage('');  mainCommentImageRef.current.value=''; }} className="absolute top-0 right-0 bg-black/50 hover:bg-black/40 cursor-pointer rounded-full"/>
              <img src={commentImage} className="max-w-80" alt="" />
            </div>
            }
        </CardFooter>
      </div>
  </div>}
 

{/* Show post details */}
 {deletedPost!=post._id&& postId===post.id&& <div onClick={parentClose} key={post.user.id} className={` ${postId===post.id?'fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center col-span-12 col-start-1 px-2 bg-black/40 z-9':'hidden'} rounded-lg`}>
       <div onClick={handleClose} className='relative w-xl dark:bg-[#252728] rounded-lg max-h-200'>


{/* Post Header - Detailed */}
        <div className="sticky top-0 z-101 dark:bg-[#252728] rounded-t-lg w-full flex items-center justify-center py-3 border-b">
           <h2 className="font-semibold"> {post.user.name.split(' ',1)}'s Post</h2>
           <button onClick={parentClose} className="absolute top-2 hover:bg-white/10 rounded-full right-2 p-1 cursor-pointer" > <X/> </button>
        </div>
       <div className=" max-h-150 rounded-lg scrollbar-thin scrollbar-thumb-chart-1 overflow-auto">
        <div className="flex justify-start items-center w-full p-2 pb-1">
          <div className="flex gap-2">
          <div className="bg-[#E5E8EB] w-10 h-10 rounded-full">
            <img className="rounded-full w-10 h-10 object-cover" src={post.user.photo} alt="" />
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


{/* Post body Regular - Detailed */}
         <p className="text-lg ps-2">{post.body}</p>
        
        {post.image&&!post.isShare&&<AspectRatio onClick={()=>{setShowPostPhoto(!showPostPhoto);document.body.classList.toggle('overflow-hidden')}} className={`dark:bg-black aspect-video rounded-b-lg `}>
          <img
            src={post.image}
            ref={imageRef}
            alt="Photo"
            fill={`true`}
            className={`aspect-video object-cover w-full  object-center `}
          />
        </AspectRatio>}
          {post.image&&!post.isShare&&showPostPhoto&&<AspectRatio onClick={()=>{setShowPostPhoto(!showPostPhoto);document.body.classList.toggle('overflow-hidden')}} className={`z-99 fixed top-0 bottom-0 left-0 right-0 bg-black/80 flex justify-center `}>
          <img
            onClick={(e)=>e.stopPropagation()}
            src={post.image}
            ref={imageRef}
            alt="Photo"
            fill={`true`}
            className={`aspect-video object-contain w-3/5  object-center `}
          >
            
          </img>
            <X className="absolute top-10 right-20 size-8 cursor-pointer hover:bg-white/20 bg-white/10 rounded-full p-1"/>
        </AspectRatio>}
      

{/* Post body Shared - Detailed */}
      {post.isShare&&<div className="bg-[#252728] px-2 w-full">

        <div className={`border rounded-lg`}>
          <div className="flex justify-start items-center w-full p-2 pb-0">
            <div className="flex gap-2">
            <div className="bg-[#E5E8EB] w-10 h-10 rounded-full">
              <img className="rounded-full w-10 h-10 object-cover" src={post.sharedPost.user.photo} alt="" />
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
          <p className="text-lg ps-2 pb-1">{post.sharedPost.body}</p>
           {post.sharedPost.image&&<AspectRatio onClick={()=>{setShowPostPhoto(!showPostPhoto);document.body.classList.toggle('overflow-hidden')}} className={`dark:bg-black aspect-video rounded-b-lg `}>
          <img
            src={post.sharedPost.image}
            ref={imageRef}
            alt="Photo"
            fill={`true`}
            className={`aspect-video object-cover w-full  object-center `}
          />
        </AspectRatio>}
          {post.sharedPost.image&&showPostPhoto&&<AspectRatio onClick={()=>{setShowPostPhoto(!showPostPhoto);document.body.classList.toggle('overflow-hidden')}} className={`z-99 fixed top-0 bottom-0 left-0 right-0 bg-black/80 flex justify-center `}>
          <img
            onClick={(e)=>e.stopPropagation()}
            src={post.sharedPost.image}
            ref={imageRef}
            alt="Photo"
            fill={`true`}
            className={`aspect-video object-contain w-3/5  object-center `}
          >
            
          </img>
            <X className="absolute top-10 right-20 size-8 cursor-pointer hover:bg-white/20 bg-white/10 rounded-full p-1"/>
        </AspectRatio>}
  
        </div>
        </div>
        }


{/* Post actions - Detailed */}
       <CardFooter className={`border-0 flex-col items-start`}>
        <div className="">
        <Button onClick={likePost} className={` bg-inherit text-white/80 hover:bg-white/10 cursor-pointer rounded-t-none h-10 w-14`}> <Heart className={`size-5 ${post.likes?.includes(Cookies.get('userId'))?'fill-red-500 stroke-0':'stroke-1'}`}/> <span className="text-xs" >{post.likesCount} </span> </Button>
        <Button onClick={()=>{getComments(post.id)}} disabled={postId} className={`bg-inherit text-white/80 hover:bg-white/10 cursor-pointer rounded-t-none h-10 w-14`}> <MessageCircleMoreIcon className="size-5 stroke-1"/><span className="text-xs" >{post.commentsCount} </span> </Button>
        <PostShare getUpdatedPostDetails={getUpdatedPostDetails} isOpen={isOpen} post={post} setIsOpen={setIsOpen} shareRef={shareRef} />
        </div>

{/* Comments and Replies */}
        {!gettingComments&&!isLoading?(postComments.length!=0?postComments.map((comment,index)=>(
         <div key={index} className="flex px-1 mb-3">
            <div className="size-7 rounded-full flex  shrink-0 object-cover dark:bg-[#E5E8EB]">
                <img src= {comment.commentCreator.photo} className="size-7 rounded-full object-cover" alt="" />
            </div>
            <div className="flex flex-col">
            <div className=" rounded-lg min-w-25 ">
            <div className="ps-1">
              <div className="flex text-sm">
            <ProfileHover userId={comment.commentCreator._id} name={comment.commentCreator.name} photo={comment.commentCreator.photo} username={comment.commentCreator.username} />
             <span  className="text-xs font-semibold ps-1 text-white/60 mt-1 items-start underline-offset-1  " >· {handleDate(comment.createdAt)}</span>
              </div>
            <p className="text-md font-extralight">
            {comment.content}
            </p>
            </div>

            {comment.image&&<img onClick={()=>{setShowCommentPhoto(true);document.body.classList.add('overflow-hidden')}} src={comment.image} alt="" className="max-w-xs rounded-lg" />}
          {comment.image&&showCommentPhoto&&<AspectRatio onClick={()=>{setShowCommentPhoto(false)}} className={`z-999 fixed top-0 bottom-0 left-0 right-0 bg-black/80 flex justify-center `}>
          <img
            onClick={(e)=>e.stopPropagation()}
            src={comment.image}
            ref={imageRef}
            alt="Photo"
            fill={`true`}
            className={`aspect-video object-contain w-3/5  object-center `}
          >
            
          </img>
            <X className="absolute top-10 right-20 size-8 cursor-pointer hover:bg-white/20 bg-white/10 rounded-full p-1"/>
        </AspectRatio>}
            </div>
            <div className="flex gap-2 ps-1">
                <button onClick={()=>{likeComment(comment._id); }} className={`text-[10px] hover:underline p-0 mt-1 items-start underline-offset-1 cursor-pointer ${likesHistory.some(item => item.id==comment._id&&item.likes.includes(Cookies.get('userId')))&&'text-blue-500'} `}> <p>{(likesHistory.find(item=>item.id==comment._id)?.likes.length>0&&likesHistory.find(item=>item.id==comment._id).likes.length)} {likesHistory.some(item=> item.id==comment._id&&item.likes.includes(Cookies.get('userId')))?<i className="fa-solid fa-thumbs-up"></i>:'Like'} </p> </button>
                <button onClick={()=>setShowReplyBox(comment._id)} className="text-[10px] hover:underline p-0 mt-1 items-start underline-offset-1 cursor-pointer "> Reply</button>
                {(comment.repliesCount>0)&&<button onClick={()=>getCommentReplies(comment._id)} className="text-[10px] hover:underline p-0 mt-1 flex items-center gap-0.5 underline-offset-1 cursor-pointer "> {repliesShowed==comment._id?'hide':`Show ${comment.repliesCount}`}  replys {repliesShowed==comment._id?<ChevronUp className="size-3"/>:<ChevronDown className="size-3"/>} </button>}
            </div>
            {showReplyBox==comment._id&&
                    <div className={` relative flex flex-col items-start gap-1.5 min-w-60 w-full py-1.5 `}>
                        
                          <div className="relative grow rounded-3xl  ">
                        <Textarea ref={replyTextRef} onChange={(e)=>{setReplyCommentText(e.target.value)}} onFocus={()=>setFocus(true)}  placeholder={`Reply to ${comment.commentCreator.name} `} className={` break-all min-w-60 min-h-0 max-w-xs scrollbar-thumb-chart-1  max-h-100 rounded-3xl ${(focus&&replyTextRef.current?.value||replyCommentHasImage)&&`rounded-b-none`} resize-none  border-0 focus-visible:ring-0 `}/>

                        <div className=" w-full rounded-b-3xl flex  bg-[#2E2F30]">
                        {(replyTextRef.current?.value||replyCommentHasImage)&&<button disabled={(isLoading&&!replyTextRef.current?.value) || (!textComment&&!replyCommentHasImage)} onClick={()=>replyComment(comment._id)} className={`ms-auto  ${(focus&&replyTextRef.current?.value)||replyCommentHasImage?'':'absolute bottom-0 right-0'} -translate-y-1/4 -translate-x-1/4 w-6 h-6 text-center ${(!isLoading&&replyTextRef.current?.value||replyCommentHasImage)&&'cursor-pointer hover:bg-white/10 text-[#0866FF]'}  rounded-full` }>
                        {isLoading&&!replyTextRef.current?.value? <Spinner className={`size-5`} />:<i className="fa-solid fa-paper-plane text-xs "></i>}
                        </button>}
                                  <div className={`absolute  ${replyTextRef.current?.value||replyCommentHasImage?'right-8 bottom-1.25':'bottom-1.5 right-2'} cursor-pointer rounded-full p-1 bg-inherit  hover:bg-white/10 `}>
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
            <div className="flex border-l ps-2 ms-5 flex-col gap-1 mt-2">

                {replies.map((reply)=>{
                  if(reply.parentComment==comment._id){

                return <div key={reply._id} className="flex gap-1 p-1 ps-3 ">
                <div className="size-7 rounded-full flex  shrink-0 object-cover dark:bg-[#E5E8EB]">
                <img src= {reply.commentCreator.photo} className="size-7 rounded-full object-cover" alt="" />
                </div>
                <div className="flex flex-col  rounded-lg p-1 bg-[#1C1C1D]">
                <div className=" rounded-lg min-w-25 ">
                <div className="ps-1 ">
                  <div className="flex text-sm">
                <ProfileHover userId={reply.commentCreator._id} name={reply.commentCreator.name} photo={reply.commentCreator.photo} username={comment.commentCreator.username} />
                <span  className="text-xs ps-1 text-white/60 mt-1 items-start underline-offset-1  " >· {handleDate(reply.createdAt)}</span>
                  </div>
                <p className="text-md font-extralight">
                {reply.content}
                </p>
                </div>

                {reply?.image&&<img src={reply.image} alt="" className="max-w-xs rounded-lg" />}
                </div>
                <div className="flex gap-2 ps-1">
                    <button onClick={()=>{likeReplyComment(reply._id); }} className={`text-[10px] hover:underline p-0 mt-1 items-start underline-offset-1 cursor-pointer ${repliesLikesHistory.some(item => ((item.id==reply._id)&&item.likes?.includes(Cookies.get('userId'))) )&&'text-blue-500'} `}> <p>{(repliesLikesHistory.find(item=>item.id==reply._id)?.likes?.length>0&&repliesLikesHistory.find(item=>item.id==reply._id).likes?.length)} {repliesLikesHistory.some(item=> (item.id==reply._id)&&item.likes?.includes(Cookies.get('userId')))?<i className="fa-solid fa-thumbs-up"></i>:'Like'} </p> </button>
                </div>
            </div>
                    
                    </div>
                  }
                })}
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

    {/* Write Comment */}
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
                    <div className={`absolute  ${subTextRef.current?.value||subCommentHasImage?'right-8 bottom-1.25':'bottom-1.5 right-2'} cursor-pointer rounded-full p-1  hover:bg-white/10 `}>
                    <ImageIcon onClick={handleSubCommentImageClick} className="text-white size-4 " />
                    <input ref={subCommentImageRef} onChange={handleSubCommentImage} className="hidden" type="file" accept="image/*" />
                    </div>
          </div>
            </div>

        </div>
              {subCommentHasImage&&
              <div className="relative w-fit p-2 ">
                <X onClick={()=>{setSubCommentHasImage(false); setCommentImage('');  subCommentImageRef.current.value=''; }} className="absolute top-0 right-0 bg-black/50 hover:bg-black/40 cursor-pointer rounded-full"/>
              <img src={commentImage} className=" max-w-30 "  alt="" /> 
              </div>}
        
        
       </div>
      </div>}
  </>
}
