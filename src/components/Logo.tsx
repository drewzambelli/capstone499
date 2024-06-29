import React from 'react'
import IMAGES from './img/images'
function Logo() {
  return (
    <img 
        src={IMAGES.logo}
        style={{ width:'200px', paddingTop: '7px'}} // Example dimensions
        alt="Logo"
    />
  )
}

export default Logo