import React from 'react'
import Logo from './Logo'
import Nav from './Nav'
import { TextField } from '@mui/material'
import FormLocal from './Form'
function Header() {
  return (
    <header className='bg-black sticky top-0 z-[20] mx-auto w-full item-center flex justify-between border-b border-gray-500 p-8'>
        <Logo/>
        <FormLocal/>
    </header>
  )
}

export default Header