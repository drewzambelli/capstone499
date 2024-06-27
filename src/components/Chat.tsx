import React from 'react'

function Chat() {
  return (
<<<<<<< HEAD
    <div className='w-[25vw] h-full block bg-blue-100'>
      <div className='h-[7vh] bg-gradient-to-r from-bubble-gum to-dark-bubble flex justify-center items-center text-3xl font-Righteous'>Chat Locally</div>
      <div className='h-[82vh] bg-black overflow-hidden'>
        <div className='text-white h-[74vh]'>
          Chats here
          </div>
        <div className='flex items-end'>
          <div className='w-full p-2 flex'>
            <textarea className='form-control overflow-hidden resize-none' placeholder='Enter Thoughts Here!' rows={3}></textarea>
            <button type='button' className='btn btn-primary bg-bubble-gum'>Send</button>
          </div>
        </div>
      </div>
    </div>
=======
    <div className='w-[25vw] h-100 bg-blue-100'>Chat</div>
>>>>>>> origin/dev
  )
}

export default Chat