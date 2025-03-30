import React from 'react'
import { Link } from 'react-router-dom' 

const Navbar = () => {
  return (
    <nav className='h-[72px] bg-black text-white hidden w-full lg:flex justify-center relative px-6 lg:px-20'>
        <div className="h-full w-full max-w-7xl flex justify-between items-center">
        <div className="h-full flex gap-4 items-center">
        <h1>Logo</h1>
        <h1 className=" flex items-center"><a href="/">Jubilee Coders</a></h1>
        </div>
        <div className="flex gap-6">
        <a href="/zone">Zone</a>
        <a href="/">About Us</a>
        <a href="/">Contact Us</a>
        </div>
        </div>
    </nav>
  )
}

export default Navbar
