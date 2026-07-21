/* eslint-disable react-hooks/set-state-in-effect */
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import GetPosts from "@/components/GetPosts/GetPosts";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Edit, FlameIcon,Image, ImagePlusIcon, PencilLineIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const [posts,setPosts] = useState([])
  const [profile,setProfile] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allowPost, setAllowPost] = useState(false);
  const [text, setText] = useState('  ');
  const [hasImage, setHasImage] = useState(false);
  useEffect(() => {
    if(!Cookies.get('userToken')){
      navigate('/login');
    }
    window.scrollTo({top:0, behavior:"smooth"});
  }, [navigate])
  useEffect(()=>{
    if(hasImage||text.trim() !==''){ 
      setAllowPost(true)
    }else {setAllowPost(false)}
  },[hasImage,text])
  useEffect(()=>{
    async function getPosts(){
      try {
        setIsLoading(true);
        const [postsResponse,profileResponse] = await Promise.all([
          axios.get(`https://route-posts.routemisr.com/posts?page=1&limit=50`,{
          headers:{
            'Token':Cookies.get('userToken')
          }}),
          axios.get("https://route-posts.routemisr.com/users/profile-data", {
              headers: {
                Token: Cookies.get("userToken"),
              },
            }),
        
      ]) 
          setPosts(postsResponse.data.data.posts)
          setProfile(profileResponse.data.data.user)
          window.scrollTo({top:0, behavior:"smooth"});
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false)
        console.log(posts);
      }
    getPosts();
  },[])

    const handleClick = (e) => {
        e.stopPropagation();
        imageRef.current.click();
    };
    
    const handlePost = async () => {
        setIsPosting(true);
        const image = imageRef.current.files[0];
        const formData = new FormData();

        formData.append("body", text);
        if (image) {
        formData.append("image", image);
        }
        try {
         await axios.post(
            "https://route-posts.routemisr.com/posts",
            formData,
            {
            headers: {
                Token: Cookies.get("userToken"),
            },
            },);
          } catch (error) {
            console.log(error.response);
          }
          setIsDialogOpen(false)
          setHasImage(false)
          setIsPosting(false)
          window.location.reload();
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
        setText(e.target.value||"  ")
    }

  console.log(posts);
  

  return <>
    <div className="py-20 ">
       {/* <Sidebar profile={profile} /> */}
    <div className="grid grid-cols-13 gap-2">
      {isLoading&&
    <Card className="col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5 ">
      <CardHeader>
        <div className="flex w-fit items-center gap-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="grid gap-2">
            <Skeleton className="h-2 w-37.5" />
            <Skeleton className="h-2 w-25" />
          </div>
        </div>
        <Skeleton className="h-3 mt-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
      }
      {isLoading&&
    <Card className="col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5">
      <CardHeader>
        <div className="flex w-fit items-center gap-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="grid gap-2">
            <Skeleton className="h-2 w-37.5" />
            <Skeleton className="h-2 w-25" />
          </div>
          
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
      }

       {!isLoading&&<div className="col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-5 lg:col-start-5">
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
              setImagePreview(null);
              setText('  ');
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
                {isPosting&&<div className="absolute bg-white/20 flex items-center justify-center h-full w-full rounded-lg ">
                <Spinner className={`size-10`} />
                </div>}
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
       </div>
          }

      { posts.map((post)=>(
      <GetPosts key={post.id} post={post} photo={profile.photo} />
      )       
      )}
    </div>
    </div>
  </>
}
