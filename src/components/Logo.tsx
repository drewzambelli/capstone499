import React from 'react'
import IMAGES from './img/images'
function Logo() {
  return (
    <div className='flex justify-center w-full text-center text-white font-modak text-6xl py-1 pt-2'>
    Locally
    <img 
        src= {IMAGES.marker}
        width={60}
        height={30}
        className= 'align-top'
        />{' '}
    </div>
  )
}

export default Logo