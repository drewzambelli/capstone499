import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import FormLocal from './Form'

function Nav() {
  return (
    <nav className='w-1/3'>
        <div className="flex justify-between">
          <FormLocal/>
        </div>
    </nav>
  )
}

export default Nav