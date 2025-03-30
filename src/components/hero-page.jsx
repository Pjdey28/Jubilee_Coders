import { CircleArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from "react-router-dom"

const HeroPage = () => {

  const navigate = useNavigate();
  return (
    <section className='h-[100vh] lg:h-[calc(100vh-72px)] w-full flex justify-center relative px-6 lg:px-20 bg-black text-white'>
    <div className='w-full max-w-7xl flex justify-center items-center flex-col gap-10'>
    <div className='text-center w-[90%] text-4xl md:text-5xl lg:text-6xl xl:text-7xl font'>
   <h1>Embark on a Journey of Discovery</h1>
   <h1>Inspiration with Us</h1>
    </div>
    <button 
    onClick={() => navigate("/chat-bot")} 
    className='text-xl md:text-2xl bg-blue-500 text-black p-3 md:p-5 rounded-full'><a href="/chat-bot" className=' flex items-center cursor-pointer gap-2'>Chat with BOT<CircleArrowRight/></a></button>
    </div>
   </section>
  )
}

export default HeroPage