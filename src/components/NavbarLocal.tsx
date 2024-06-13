import React from 'react'
import { Nav, Navbar, Container } from 'react-bootstrap'
import IMAGES from './img/images'
function NavbarLocal() {
  return (
    <Navbar expand="lg" className='bg-body-tertiary bg-black'>
        <Container>
            <Navbar.Brand href='/' className='flex justify-center w-full text-center text-white font-modak text-6xl py-1 pt-2'>
            Locally
            <img 
                src= {IMAGES.marker}
                width={60}
                height={30}
                className= 'align-top'
                />{' '}
            </Navbar.Brand>
        </Container>
    </Navbar>
)
}

export default NavbarLocal