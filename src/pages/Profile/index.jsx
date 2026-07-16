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
import { useNavigate } from "react-router-dom";
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


export default function Profile() {
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const profileImageRef = useRef(null);
  const [allowPost, setAllowPost] = useState(false);
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [hasImage, setHasImage] = useState(false);
  const [profile, setProfile] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [myPosts, setMyPosts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if(!Cookies.get('userToken')){
      navigate('/login');
    }
  }, [navigate]) 

  useEffect(() => {
    async function getMyProfile() {
      try {
        const [profileResponse, suggestionResponse, postsResponse] =
          await Promise.all([
            axios.get("https://route-posts.routemisr.com/users/profile-data", {
              headers: {
                Token: Cookies.get("userToken"),
              },
            }),
            axios.get(
              "https://route-posts.routemisr.com/users/suggestions?limit=8",
              {
                headers: {
                  Token: Cookies.get("userToken"),
                },
              },
            ),
            axios.get(
              `https://route-posts.routemisr.com/users/${Cookies.get("userId")}/posts`,
              {
                headers: {
                  Token: Cookies.get("userToken"),
                },
              },
            ),
          ]);
        setProfile(profileResponse.data.data.user);
        setSuggestions(suggestionResponse.data.data.suggestions);
        setMyPosts(postsResponse.data.data.posts);
      } catch (error) {
        console.log(error);
      }
    }
    getMyProfile();
  }, []);

  useEffect(()=>{
    if(hasImage||text.trim() !==''){ 
      setAllowPost(true)
    }else {setAllowPost(false)}
  },[hasImage,text])
 async function changeProfilePhoto(e) {
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

 console.log(profile);

  return (
    <>
      <div className="grid grid-cols-12 gap-5 py-2 dark:bg-[#252728]">
        <div className="mt-20 col-span-8 col-start-3">
          <div className="flex flex-col md:flex-row justify-center items-center gap-5 w-full">
            <div className="relative rounded-full w-50 h-50 dark:bg-[#E5E8EB]">
              <img
                
                className="rounded-full w-50 h-50 object-cover "
                src={profile.photo}
                alt=""
              />
              <div onClick={handleProfileImageClick} className="absolute flex items-center justify-center opacity-0 hover:opacity-100 transition-all  w-full h-full rounded-full cursor-pointer top-0">
              <Edit className="" size={30} />
              </div>
              <input ref={profileImageRef} onChange={changeProfilePhoto}  type="file" className="hidden" />
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
              <div className="flex gap-2 ">
                <Button onClick={() => navigate("/bookmarks")}>
                  <BookmarkIcon className="" /> BookMarks
                </Button>
                <Button onClick={() => navigate("/edit-profile")}>
                  <PenBoxIcon className="" /> Edit profile
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end">
         <Button onClick={()=>setShowSuggestions(!showSuggestions)} variant="outline" size="icon" className="cursor-pointer">
        {showSuggestions?<ChevronDown />:<ChevronUp/>}
      </Button>
          </div>
        </div>
        <div className="col-span-8 col-start-3 border-b border-white/30 pb-5 ">
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
                      />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-1 cursor-pointer hover:underline w-fit">
                          {suggestion.name}
                        </CardTitle>
                        <CardDescription>
                          Followed by {suggestion.followersCount}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button className="w-full bg-blue-400/20 text-blue-300/90 hover:bg-blue-400/40 cursor-pointer">
                          Follow
                        </Button>
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
      {isLoading&&<div className="sticky z-999 h-screen top-0 bottom-0 right-0 left-0 bg-white/10 flex items-center justify-center" >
                  <Spinner className={`size-20`} />
                </div>}
      <div className="grid grid-cols-12 dark:bg-[#1C1C1D] py-5 gap-3">
        <div className="col-span-3 grow-0 h-fit col-start-3 ">
          <div className="bg-[#252728] p-3 py-5 mb-3 rounded-lg">
          <h3 className="text-lg font-semibold mb-5">Personal details</h3>
          <div className="ps-2 flex flex-col gap-4">
          <p className="flex gap-5 text-sm" ><CakeIcon size={20}/>{handleBirthDate(profile.dateOfBirth)}</p> 
          <p className="flex gap-4 text-sm ps-1"> <span className="relative"><Circle size={20} className="absolute -left-1/2"/> <Circle size={20} className=""/></span>{profile.gender&&profile.gender[0].toUpperCase()}{profile?.gender?.substring(1)} </p>
          <p className="flex gap-5 text-sm"><DoorOpenIcon size={20}/> Member scince {handleJoindDate(profile.createdAt)}</p>
          </div>
          </div>
          <div className="bg-[#252728] p-3 py-5 rounded-lg">
          <h3 className="text-lg font-semibold mb-5">Followers</h3>
          <div className="">

          </div>
          </div>
        </div>
        <div className="col-span-5 col-start-6 h-fit  ">
          <div className="p-3 mb-2 bg-[#252728]  rounded-lg">
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
          </div>
        {myPosts.map((post)=>(
          <div key={post.id} className="mb-2 bg-[#252728] rounded-lg ">
              <GetPosts post={post} photo={profile.photo} />
        </div>
        )  
        )}
        </div>
        

      </div>
    </>
  );
}
