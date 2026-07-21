/* eslint-disable react-hooks/set-state-in-effect */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  BookmarkIcon,
  CakeIcon,
  Camera,
  ChevronDown,
  ChevronUp,
  Circle,
  DoorOpenIcon,
  Edit,
  FlameIcon,
  Image,
  ImagePlusIcon,
  PenBoxIcon,
  PencilLineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import GetPosts from "@/components/GetPosts/GetPosts";
import Follow from "@/components/Follow/Follow";
import ProfileHover from "@/components/ProfileHover/ProfileHover";


export default function Profile() {
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);
  const [allowPost, setAllowPost] = useState(false);
  const [text, setText] = useState('  ');
  const [show, setShow] = useState('all');
  const [imagePreview, setImagePreview] = useState(null);
  const [hasImage, setHasImage] = useState(false);
  const [profile, setProfile] = useState([]);
  const [myprofile, setMyprofile] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {id} = useParams();

  useEffect(() => {
    window.scrollTo(top);
    if(!Cookies.get('userToken')){
      navigate('/login');
    }
  }, [navigate]) 


  useEffect(() => {
    if(Cookies.get('userId')==id)setMyprofile(true);
    else setMyprofile(false);
    window.scrollTo(top);
    setProfile([]);
    setFollowers([]);
    setFollowing([]);
    setSuggestions([]);
    setMyPosts([]);
    setIsLoading(true)
    async function getMyProfile() {
      try {
        const [profileResponse, suggestionResponse, postsResponse] =
          await Promise.all([
            axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
              headers: {
                Token: Cookies.get("userToken"),
              },
            }),
            axios.get(
              "https://route-posts.routemisr.com/users/suggestions?page=1&limit=8",
              {
                headers: {
                  Token: Cookies.get("userToken"),
                },
              },
            ),
            axios.get(
              `https://route-posts.routemisr.com/users/${id}/posts`,
              {
                headers: {
                  Token: Cookies.get("userToken"),
                },
              },
            ),
          ]);
        setProfile(profileResponse.data.data.user);
        setFollowers(profileResponse.data.data.user.followers)
        setFollowing(profileResponse.data.data.user.following)
        setSuggestions(suggestionResponse.data.data.suggestions);
        setMyPosts(postsResponse.data.data.posts);
        window.scrollTo(top);
      } catch (error) {
        console.log(error);
      }
       setIsLoading(false)
    }
    getMyProfile();
  }, [id]);

  useEffect(()=>{
    if(hasImage||text.trim() !==''){ 
      setAllowPost(true)
    }else {setAllowPost(false)}
  },[hasImage,text])

 async function changeProfilePhoto(e) {
   setIsLoading(true);
  try {
    const formdata = new FormData();
    formdata.append('photo',e.target.files[0]);
    const response = await axios.put(`https://route-posts.routemisr.com/users/upload-photo`,formdata,
      {headers:{
        Token:Cookies.get('userToken')
      
      }})
  console.log(response);
 
  } catch (error) {
    console.log(error.response);
    
  }
   setIsLoading(false);

  }
 async function changeCoverPhoto(e) {
  setIsLoading(true);
  try {
    const formdata = new FormData();
    formdata.append('cover',e.target.files[0]);
    const response = await axios.put(`https://route-posts.routemisr.com/users/upload-cover`,formdata,
      {headers:{
        Token:Cookies.get('userToken')
        
      }})
      console.log(response);
      
    } catch (error) {
      console.log(error.response);
      
    }
    setIsLoading(false);
  }
  const handleClick = (e) => {
    e.stopPropagation();
    imageRef.current.click();
  };
  
  const handlePost = async () => {
    setIsLoading(true);
    const image = imageRef.current.files[0];
    const formData = new FormData();

    formData.append("body", text);
    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await axios.post(
        "https://route-posts.routemisr.com/posts",
        formData,
        {
          headers: {
            Token: Cookies.get("userToken"),
          },
        },
      );
      console.log((await response).data);
      
    } catch (error) {
      console.log(error.response);
    }
    setIsDialogOpen(false)
    setText('  ')
    setHasImage(false)
    setIsLoading(false)

  };

  const handleImage = () => {
    const file = imageRef.current?.files[0];
    if (file) {
      setHasImage(true);
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
    }else {
      setHasImage(false);
      setImagePreview(null);
    }
  };

  const handleText =(e)=>{
    setText(e.target.value)
  }
  function handleBirthDate(date){
    const birthDate = new Date(date);
     const month = birthDate.toLocaleString("en-US",{
      month:'long'
    })
    
    return`${month} ${birthDate.getDate()}`

  }
  function handleJoindDate(date){
    const createdDate = new Date(date);
     const month = createdDate.toLocaleString("en-US",{
      month:'long'
    })
    
    return`${createdDate.getFullYear()} ${month} `

  }
  function handleProfileImageClick(e){
    e.stopPropagation();
    profileImageRef.current.click();
  }
  function handleCoverImageClick(e){
    e.stopPropagation();
    coverImageRef.current.click();
  }


console.log();

  return (
    <>
{/* TOP*/}
    {/* Profile Info */}
      <div className="grid grid-cols-12 gap-5 pt-15 pb-0 md:pb-4 dark:bg-[#252728]">
        {/* Cover Photo */}
        <div className="relative col-span-12 lg:rounded-lg lg:col-span-8 lg:col-start-3 bg-[#919393] min-h-50 lg:min-h-70 h-fit max-h-80  flex items-center justify-center overflow-hidden">
          <img src={profile.cover} className="object-cover object-center w-full" alt="" />
              {myprofile&&<div onClick={handleCoverImageClick} className="absolute bottom-1 right-1 text-xs text-black p-1 bg-white flex items-center justify-center font-medium gap-1 transition-all w-fit rounded-md cursor-pointer ">
              <Camera fill="true" className="size-5 stroke-white "/> Edit cover photo
              <input ref={coverImageRef} onChange={changeCoverPhoto}  type="file" className="hidden" />
              </div>}
        </div>
        <div className=" col-span-8 col-start-3">
          <div className="flex flex-col md:flex-row justify-center items-center gap-5 w-full">
        {/* Profile Photo */}
            <div className="relative rounded-full -mt-15 w-fit dark:bg-[#E5E8EB]">
              <img
                
                className="rounded-full size-40 md:size-50 object-cover "
                src={profile.photo}
                alt=""
              />
              {myprofile&&<div onClick={handleProfileImageClick} className="absolute bottom-0 right-0 flex items-end justify-end transition-all hover:bg-white/20 p-1 rounded-full cursor-pointer ">
              <Camera className="size-8" />
              <input ref={profileImageRef} onChange={changeProfilePhoto}  type="file" className="hidden" />
              </div>}
            </div>
            
            <div className="flex flex-col items-center xl:justify-between xl:grow xl:flex-row gap-2">
              <div className="flex justify-center items-center xl:items-start flex-col md:gap-2">
                <div className="flex flex-col md:flex-row items-center md:items-end  md:gap-3">
                  <h2 className="text-2xl font-semibold">{profile.name}</h2>
                  <span className="text-sm pb-0.5 dark:text-[#a1a1a1]">
                    @{profile.username}
                  </span>
                </div>
                <span className="text-sm ps-1">
                  {profile.followersCount} followers
                </span>
              </div>
              <div className="flex gap-2 grow justify-end ">
               {myprofile&& <Button onClick={() => navigate("/bookmarks")}>
                  <BookmarkIcon className="" /> BookMarks
                </Button>}
                {myprofile&&<Button onClick={() => navigate("/edit-profile")}>
                  <PenBoxIcon className="" /> Edit profile
                </Button>}
                {!myprofile&&
                <div className="w-60">
                  <Follow userId={id} />
                </div>
                }
                <Button onClick={()=>setShowSuggestions(!showSuggestions)} variant="outline" size="icon" className="hidden md:flex cursor-pointer">
                  {showSuggestions?<ChevronUp/>:<ChevronDown />}
                </Button>
              </div>
            </div>
          </div>

        </div>
        <div className="col-span-8 col-start-3 md:border-b border-white/30 pb-5 ">
        {showSuggestions&&<div className="border rounded-lg p-2">
          <h2 className="ps-1 py-2 font-semibold ">People you may know</h2>
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full max-w-full "
          >
            <CarouselContent>
              {suggestions.map((suggestion) => (
                
                <CarouselItem
                  key={suggestion._id}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-2/11"
                >
                  <div className="p-0">
                    <Card className="relative mx-auto w-full max-w-sm pt-0 ">
                      <div className="overflow-hidden">
                      <img
                        src={suggestion.photo}
                        alt="Event cover"
                        className="relative z-20 aspect-square w-full object-cover cursor-pointer transition-all duration-400 hover:scale-125 "
                         onClick={()=>navigate(`/profile/${suggestion._id}`)}
                      />
                      </div>
                      <CardHeader>
                        <CardTitle  onClick={()=>navigate(`/profile/${suggestion._id}`)} className="line-clamp-1 cursor-pointer hover:underline w-fit">
                          {suggestion.name}
                        </CardTitle>
                        <CardDescription>
                          Followed by {suggestion.followersCount}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Follow userId={suggestion._id} />
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>}
        </div>
      </div>

    {/* loading Screen */}
      {isLoading&&<div className="sticky z-999 h-screen top-0 bottom-0 right-0 left-0 bg-white/30 flex items-center justify-center" >
                  <Spinner className={`size-20`} />
                </div>}

      <div className="grid grid-cols-12 dark:bg-[#1C1C1D] pb-10  pt-2 md:py-5 md:gap-3">
      <div className="flex md:hidden justify-around border-b col-span-12 bg-[#252728]">
          <span onClick={()=>setShow('all')} className={`w-full text-center py-3 cursor-pointer hover:bg-white/10 ${show==='all'&&'text-blue-500 border-b border-blue-500'} `} >All</span>
          <span onClick={()=>setShow('posts')} className={`w-full text-center py-3 cursor-pointer hover:bg-white/10 ${show==='posts'&&'text-blue-500 border-b border-blue-500'} `} >Posts</span>
          <span onClick={()=>setShow('about')} className={`w-full text-center py-3 cursor-pointer hover:bg-white/10 ${show==='about'&&'text-blue-500 border-b border-blue-500'} `} >About</span>
        </div>
{/*  left */}
        {(show=='all'||show=='about')&&<div className="col-span-12  md:col-span-4 md:col-start-1 lg:col-span-3 lg:col-start-3 grow-0 h-fit  ">
    {/* Personal Details */}
          <div className="bg-[#252728] p-3 py-5  md:rounded-lg">
          <h3 className="text-lg font-semibold mb-5">Personal details</h3>
          <div className="ps-2 flex flex-col gap-4">
          <p className="flex gap-5 text-sm" ><CakeIcon size={20}/>{handleBirthDate(profile.dateOfBirth)}</p> 
          <p className="flex gap-4 text-sm ps-1"> <span className="relative"><Circle size={20} className="absolute -left-1/2"/> <Circle size={20} className=""/></span>{profile.gender&&profile.gender[0].toUpperCase()}{profile?.gender?.substring(1)} </p>
          <p className="flex gap-5 text-sm"><DoorOpenIcon size={20}/> Member scince {handleJoindDate(profile.createdAt)}</p>
          </div>
          </div>
    {/* Followers */}
          <div className="flex flex-col bg-[#252728] p-3 py-5 md:mt-3 md:rounded-lg">
          <h3 className="relative text-md font-semibold">Followers
            <span onClick={()=>navigate(`/followers/${profile.id}`)} className="absolute px-2 py-1 top-0 right-0 text-sm font-light text-blue-500 rounded-lg cursor-pointer hover:bg-white/10">See all</span>
          </h3>
          <p className='mb-2 text-sm text-gray-300/60'> {profile.followersCount} Friends</p>
          <div className="grid grid-cols-6 gap-2">
            {followers.slice(0,6).map((follower)=>
              <div key={follower.id} className="col-span-2 flex flex-col gap-1 ">
                <div onClick={()=>navigate(`/profile/${follower._id}`)} className="relative overflow-hidden group cursor-pointer rounded-lg">
                    <img src={follower.photo} className="object-cover rounded-lg aspect-square" alt="" />
                <div className="bg-white/10 absolute top-0 w-full h-0 group-hover:h-100 ">
                </div>
                </div>
                <ProfileHover name={follower.name}  photo={follower.photo} userId={follower.id} />
              </div>
            )}
          </div>
          </div>
    {/* Following */}
          <div className=" bg-[#252728] p-3 py-5 md:mt-3 md:rounded-lg">
          <h3 className="relative text-md font-semibold">Following
            <span onClick={()=>navigate(`/followings/${profile.id}`)} className="absolute px-2 py-1 top-0 right-0 text-sm font-light text-blue-500 rounded-lg cursor-pointer hover:bg-white/10">See all</span>
          </h3>
          <p className='mb-2 text-sm text-gray-300/60'>Follows {profile.followingCount} accounts</p>
          <div className="grid overflow-hidden grid-cols-6 gap-2">
            {following.slice(0,6).map((follower)=>
              <div key={follower.id} className="col-span-2 flex flex-col gap-1 ">
                <div onClick={()=>navigate(`/profile/${follower._id}`)} className="relative overflow-hidden group cursor-pointer rounded-lg">
                    <img src={follower.photo} className="object-cover bg-[#E2E5E9] min-w-full rounded-lg aspect-square" alt="" />
                <div className="bg-white/10 absolute top-0 w-full h-0 group-hover:h-100 ">
                </div>
                </div>
                <ProfileHover name={follower.name}  photo={follower.photo} userId={follower.id} />
              </div>
            )}
          </div>
          </div>
        </div>}

{/*  Right */}
    {/* Create Post and Posts */}
        {(show=='all'||show=='posts')&&<div className="col-span-12 md:col-span-8 md:col-start-5 lg:col-span-5 lg:col-start-6 h-fit  ">
          {profile.id==Cookies.get('userId')&&<div className="p-3 mb-2 bg-[#252728]  md:rounded-lg">
            <h3 className="md:hidden mb-2 font-bold text-md">Posts</h3>
          <div className="flex w-full border-b mb-2 pb-2 items-center gap-2 ">
            <input
              onChange={handleImage}
              ref={imageRef}
              className="hidden"
              type="file"
              accept="image/*"
            />
            <div className="w-10 h-10 rounded-full dark:bg-[#E5E8EB]">
              <img
                src={profile.photo}
                onClick={() => window.scroll(0, 0)}
                className="w-10 h-10 object-cover rounded-full cursor-pointer"
                alt=""
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={()=>{
              setImagePreview(null)
              setIsDialogOpen(!isDialogOpen)
              }}>
              <DialogTrigger
                render={
                  <Button className="grow h-10 text-md font-light cursor-pointer text-white/50 hover:bg-[#525455] justify-start bg-[#393939] rounded-4xl">
                    Whats on your mind?
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-md bg-[#252728]">
                
                <DialogHeader>
                  <DialogTitle
                    className={`flex justify-center text-lg border-b pb-2`}
                  >
                    Create Post
                  </DialogTitle>
                  <div className={`flex gap-2`}>
                    <div className="w-10 h-10 rounded-full dark:bg-[#E5E8EB]">
                      <img
                        src={profile.photo}
                        className="w-10 h-10 rounded-full object-cover"
                        alt=""
                      />
                    </div>
                    <h2 className="text-white">{profile.name}</h2>
                  </div>
                </DialogHeader>
                <FieldGroup className={`items-start ${hasImage?'gap-0':'gap-5'}`}>
                  <Field>
                    <Textarea
                      onChange={handleText}
                      id={`bodyText`}
                      className={`${hasImage?'':'h-30 placeholder:text-2xl text-2xl!'}   dark:bg-[#252728] resize-none border-0 outline-0 focus-visible:ring-0`}
                      name="post"
                      placeholder="What's on your mind?"
                    />
                  </Field>
                  {!hasImage&&<Field
                    onClick={handleClick}
                    className={`w-fit rounded-full p-2 cursor-pointer hover:bg-white/20`}
                  >
                    <ImagePlusIcon />
                  </Field>}
                  <Field className={`w-full relative rounded-lg border`}>
                    {hasImage&& <img className="w-full rounded-lg object-cover" src={imagePreview} alt="" /> }
                    {hasImage&&<div
                    onClick={handleClick}
                    className={`absolute top-0 w-fit! rounded-full p-2 cursor-pointer hover:bg-white/20`}
                  >
                    <Edit />
                  </div>}
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <Button
                    disabled={!allowPost ? true : undefined}
                    onClick={handlePost}
                    className={`w-full bg-[#0866FF] text-white py-4`}
                  >
                    Post
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className={`grow py-5 bg-inherit text-white hover:bg-white/20 flex items-center justify-center`}
            >
              <Image /> Photo
            </Button>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className={`grow py-5 bg-inherit text-white hover:bg-white/20 flex items-center justify-center`}
            >
              <PencilLineIcon /> Post
            </Button>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className={`grow py-5 bg-inherit text-white hover:bg-white/20 flex items-center justify-center`}
            >
              <FlameIcon /> Felling
            </Button>
          </div>
          </div>}
        {myPosts.map((post)=>(
          <div key={post.id} className="mb-2 bg-[#252728] md:rounded-lg ">
              <GetPosts post={post} photo={profile.photo} />
        </div>
        )  
        )}
        </div>}
      </div>
    </>
  );
}
