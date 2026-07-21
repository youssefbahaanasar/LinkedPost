export default function handleDate(date) {
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
    else if(weaks>0 && weaks<4)return `${weaks} weak${weaks>1?'s':""} ago`;
    else if(days>0 && days<7)return `${days} day${days>1?'s':""} ago`
    else if(hours>0 && hours<24)return `${hours} hour${hours>1?'s':""} ago`;
    else if(minutes>0 && minutes<60) return `${minutes} minute${minutes>1?'s':""} ago`;
    else if(seconds>=0 && seconds<60) return "Just now";
    else return `${createdAt.getDate()} ${month} at ${createdAt.getHours().toString().padStart(2,"0")}:${createdAt.getMinutes().toString().padStart(2,"0")}`
  }