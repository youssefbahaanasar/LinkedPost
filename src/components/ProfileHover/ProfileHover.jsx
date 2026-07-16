
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Button } from '../ui/button'

export default function ProfileHover({name,photo,username}) {
  return <>
    <HoverCard>
        <HoverCardTrigger className="text-md font-semibold cursor-pointer hover:underline">{name}</HoverCardTrigger>
        <HoverCardContent className='flex gap-3 min-w-fit z-10 dark:bg-[#252728]'>
        <div className="w-20 h-20 shrink-0 rounded-full bg-[#E5E8EB]">
        <img className="w-20 h-20 shrink-0 rounded-full object-cover" src={photo} alt="" />
        </div>
        <div className="flex justify-around flex-col gap-2 pt-1">
            <div className="">
            <h2 className="text-lg cursor-pointer hover:underline line-clamp-1" >{name.split(' ',2).join(' ')}</h2>
            <h2 className="text-xs dark:text-[#b0b3b8] text-[#65686c]" >@{username}</h2>
            </div>
            <div className="w-full flex justify-start">
            <Button className='dark:text-white w-24 hover:bg-[#2176FF] bg-[#0d6afe] cursor-pointer'>Follow</Button>
            </div>
        </div>
        </HoverCardContent>
    </HoverCard>
  </>
}
