import Follow from '@/components/Follow/Follow'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
export default function Suggestions() {
    const [suggestions, setSuggestions] = useState([])
    const [page, setPage] = useState(1)
    const navigate = useNavigate();
    useEffect(()=>{
        async function getSuggestions() {
            try {
        const  suggestionResponse = await axios.get(
              `https://route-posts.routemisr.com/users/suggestions?page=${page}&limit=20`,
              {
                headers: {
                  Token: Cookies.get("userToken"),
                },
              },
            );

        setSuggestions(suggestionResponse.data.data.suggestions);
      } catch (error) {
        console.log(error.response);
      }
    }
        getSuggestions();
    },[])

   async function getMoreSuggestions(pageNum){
         try {
        const  suggestionResponse = await axios.get(
              `https://route-posts.routemisr.com/users/suggestions?page=${pageNum}&limit=20`,
              {
                headers: {
                  Token: Cookies.get("userToken"),
                },
              },
            );
            const updateSuggestion = [...suggestions,...suggestionResponse.data.data.suggestions]
        setSuggestions(updateSuggestion);
        setPage(page+1)
      } catch (error) {
        console.log(error.response);
      }
    }
  return<>
<div className="grid grid-cols-13 py-20 ">
    <div className="flex items-start col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-8 lg:col-start-5 gap-4 bg-[#252728] p-8  rounded-lg mb-5">
     <div className="size-15 flex items-center justify-center shrink-0  bg-[#2B7FFF] rounded-full ">
     <i className="fa-solid fa-user-plus text-3xl "></i>
     </div>

      <div className="">
          <h1 className="text-2xl ">Grow your network</h1>
          <p className="text-xs mt-2">Discover new people and follow them to grow your network.</p>    
      </div>
    </div>
            <div className="gap-3 col-span-13 sm:col-span-11 sm:col-start-2  lg:col-span-8 lg:col-start-5 grid grid-cols-2 px-1 sm:grid-cols-9 md:grid-cols-12 xl:grid-cols-10 ">
              {suggestions.map((suggestion) => (
                  <div className="p-0 col-span-1 sm:col-span-3 md:col-span-3 xl:col-span-2 z-1">
                    <Card className="relative mx-auto w-full max-w-sm pt-0 ">
                      <div onClick={()=>navigate(`/profile/${suggestion._id}`)} className="overflow-hidden">
                      <img
                        src={suggestion.photo}
                        alt="Event cover"
                        className="relative z-20 aspect-square w-full object-cover cursor-pointer transition-all duration-400 hover:scale-125 "
                      />
                      </div>
                      <CardHeader>
                        <CardTitle onClick={()=>navigate(`/profile/${suggestion._id}`)} className="line-clamp-1 cursor-pointer hover:underline w-fit">
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
              ))}
            <span onClick={()=>getMoreSuggestions(page+1)} className='text-blue-500 cursor-pointer hover:underline '>See more</span> 
            </div>
</div>
  </>
}
