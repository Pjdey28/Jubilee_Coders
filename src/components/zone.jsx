import React from 'react'
import { Link } from 'react-router-dom'

const Zone = () => {
  return (
    <section id='zone' className="flex justify-center px-6 lg:px-20 py-[80px] lg:py-[120px]">
      <div className="w-full max-w-7xl">
        <h1 className="text-6xl lg:text-7xl italic font-[700]">Zone</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:mt-10 gap-4'>
          <Link to="/movies" className='col-span-1 row-span-1 border-[1px] border-neutral-600 rounded-xl hover:bg-neutral-100 transition-colors duration-300'>
            <div className='flex justify-center p-10'>
              <div className='text-center'>
                <h1 className='text-3xl font-semibold'>Movies</h1>
                <p className='mt-4 text-[18px]'>Discover the latest blockbuster movies.</p>
              </div>
            </div>
          </Link>
          <Link to="/books" className='col-span-1 row-span-1 border-[1px] border-neutral-600 rounded-xl hover:bg-neutral-100 transition-colors duration-300'>
            <div className='flex justify-center p-10'>
              <div className='text-center'>
                <h1 className='text-3xl font-semibold'>Books</h1>
                <p className='mt-4 text-[18px]'>Discover the latest blockbuster movies.</p>
              </div>
            </div>
          </Link>
          <Link to="/games" className='col-span-1 row-span-1 border-[1px] border-neutral-600 rounded-xl hover:bg-neutral-100 transition-colors duration-300'>
            <div className='flex justify-center p-10'>
              <div className='text-center'>
                <h1 className='text-3xl font-semibold'>Games</h1>
                <p className='mt-4 text-[18px]'>Discover the latest blockbuster movies.</p>
              </div>
            </div>
          </Link>
          <Link to="/memes" className='col-span-1 row-span-1 border-[1px] border-neutral-600 rounded-xl hover:bg-neutral-100 transition-colors duration-300'>
            <div className='flex justify-center p-10'>
              <div className='text-center'>
                <h1 className='text-3xl font-semibold'>Memes</h1>
                <p className='mt-4 text-[18px]'>Discover the latest memes.</p>
              </div>
            </div>
          </Link>
          <Link to="/ThemePark" className='col-span-1 row-span-1 border-[1px] border-neutral-600 rounded-xl hover:bg-neutral-100 transition-colors duration-300'>
            <div className='flex justify-center p-10'>
              <div className='text-center'>
                <h1 className='text-3xl font-semibold'>Theme Parks</h1>
                <p className='mt-4 text-[18px]'>Discover amazing theme parks.</p>
              </div>
            </div>
          </Link>
          <Link to="/stories" className='col-span-1 row-span-1 border-[1px] border-neutral-600 rounded-xl hover:bg-neutral-100 transition-colors duration-300'>
            <div className='flex justify-center p-10'>
              <div className='text-center'>
                <h1 className='text-3xl font-semibold'>Stories</h1>
                <p className='mt-4 text-[18px]'>Discover interesting stories.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Zone