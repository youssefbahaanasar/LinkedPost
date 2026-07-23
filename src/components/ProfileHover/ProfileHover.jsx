
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import Follow from '../Follow/Follow'
import { useNavigate } from 'react-router-dom';

export default function ProfileHover({name,photo,username,userId}) {
  const navigate = useNavigate();
  return <>
    <HoverCard>
        <HoverCardTrigger onClick={()=>navigate(`/profile/${userId}`)} className={`${username?'text-md':'text-xs'} `}> <button className='capitalize font-semibold cursor-pointer line-clamp-1 hover:underline'>{name}</button> </HoverCardTrigger>
        <HoverCardContent className='flex gap-3 min-w-fit z-10 dark:bg-[#252728]'>
        <div className="w-20 h-20 shrink-0 rounded-full bg-[#E5E8EB]">
        <img className="w-20 h-20 shrink-0 rounded-full object-cover" src={photo} alt="" />
        </div>
        <div className="flex justify-around flex-col gap-2 pt-1">
            <div className="">
            <button  onClick={()=>navigate(`/profile/${userId}`)} className="text-lg cursor-pointer capitalize hover:underline line-clamp-1" >{name.split(' ',2).join(' ')}</button>
            {username&&<h2 className="text-xs dark:text-[#b0b3b8] text-[#65686c]" >@{username}</h2>}
            </div>
            <div className="w-full flex justify-start">
            <Follow userId={userId} />
            </div>
        </div>
        </HoverCardContent>
    </HoverCard>
  </>
}
