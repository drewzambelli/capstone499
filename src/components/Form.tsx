import { Box, TextField } from '@mui/material'
import React from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

function FormLocal() {
  return (
    <div className='flex justify-center items-center '>
      <InputGroup className='lg:flex mb-3 h-50 min-h-5'>
        <InputGroup.Text className='text-black' id="location">🔍</InputGroup.Text>
        <Form.Control
          placeholder='Enter Location'
          aria-label='Location'
          aria-describedby='Location'
          />
         <Button variant="dark">Enter</Button>
      </InputGroup>
    </div>
  )
}

export default FormLocal