import React from 'react'
import IMAGES from './img/images'
function Logo() {
  return (
    <div className='lg:flex justify-center w-full text-center text-white font-modak text-6xl pt-2 pl-14'>
    <img 
        src= {IMAGES.logo}
        height={900}
        className= 'w-25'
        />{' '}
    </div>
  )
}

export default Logo