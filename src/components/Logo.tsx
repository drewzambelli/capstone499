import React from 'react'
import IMAGES from './img/images'
function Logo() {
  return (
    <a href='/'>  
      <img 
          src={IMAGES.logo}
          style={{ width:'200px', paddingTop: '7px'}} // Example dimensions
          alt="Logo"
      />
    </a>
  )
}

export default Logo