import React, { useEffect, useState } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
function Chat() {

  const socket = io('http://localhost:3000')
  const [docs, setDocs] = useState([]);



  useEffect(()=> {
    const fetchData = async () =>{
      try{
        const response = await axios.get("http://localhost:3000/api/getPosts");
        console.log(response.data)
        if(Array.isArray(response.data))
          {setDocs(response.data)}
      }catch(error){
        console.log(error)
      }
    }
    fetchData();

    socket.on('connect', ()=>{
      console.log("SOCKET CONNECTED: ", socket.id)
    })

    socket.on('Comment', (item)=>{
      console.log("NEW COMMENT RECIEVED:", item);
      setDocs((prevDocs) => Array.isArray(prevDocs) ? [...prevDocs, item] : [item]);
    })


    return() =>{
      socket.off('Comment')
    }

  }, [])

  return (
    <div className='w-[25vw] h-full block bg-blue-100'>
      <div className='h-[7vh] bg-gradient-to-r from-bubble-gum to-dark-bubble flex justify-center items-center text-3xl font-Righteous'>Chat Locally</div>
      <div className='h-[82vh] bg-black overflow-hidden'>
        <div className='text-white h-[74vh]'>
          <ul>
            {docs.map((doc) =>(
              <li key={doc._id} className='text-white'>
                <strong>ID: </strong>{doc.id}<br/>
                <strong>comment </strong>{doc.comment}<br/>
              </li>
            ))}



          </ul>


          </div>
        <div className='flex items-end'>
          <div className='w-full p-2 flex'>
            <textarea className='form-control overflow-hidden resize-none' placeholder='Enter Thoughts Here!' rows={3}></textarea>
            <button type='button' className='btn btn-primary bg-bubble-gum'>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat