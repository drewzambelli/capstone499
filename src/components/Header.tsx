import React from 'react'
import Logo from './Logo'
function Header() {
  return (
    <header className='bg-black sticky top-0 z-[20] mx-auto w-full item-center flex justify-between border-b border-gray-500 pt-1'>
        <Logo/>
    </header>
  )
}

export default Header