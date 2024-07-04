import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {io, Socket} from 'socket.io-client'
import UserName from './userName';

function formatTimestamp(timestamp: string){
  const date = new Date(timestamp);

  const options ={
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  return date.toLocaleString('en-US', options).replace(',', ' @');
}

function Chat() {
  const [comment, setComment] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const socketRef = useRef<Socket|null>(null);
  const [docs, setDocs] = useState([]);


  const handleCommentSubmit: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    const result = await axios.get(`http://localhost:3000/api/getUser/${socketRef.current?.id}`)
    console.log(result);
    const username_ = result.data.username;
    setUsername(username_)
    event.preventDefault();
    try{
      const response = await axios.post('http://localhost:3000/api/postComment',{
        username:await  username_,
        text: comment
      })
    }catch(error){
      console.error(error)
    }
  }

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) =>{
    setComment(event.target.value)
  }

  useEffect(()=> {
    const fetchData = async () =>{
      try{
        const response = await axios.get(`http://localhost:3000/api/getPosts`);
        if(Array.isArray(response.data))
          {
            setDocs(response.data)
          }
      }catch(error){
        console.log(error)
      }
    }
    fetchData();

    socketRef.current =io('http://localhost:3000')

    socketRef.current.on('connect', ()=>{
      console.log("SOCKET CONNECTED: ", socketRef.current?.id);
    })

    socketRef.current.on('Comment', (item)=>{
      console.log("NEW COMMENT RECIEVED:", item);
      setDocs((prevDocs) => Array.isArray(prevDocs) ? [...prevDocs, item] : [item]);
    })


    return() =>{
      if(socketRef.current){
        socketRef.current.off('Comment')
        socketRef.current.disconnect;
      }
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
                <strong>{doc.username}: </strong>{doc.text}
                <p>{formatTimestamp(doc.timestamp)}</p>
              </li>
            ))}
          </ul>


          </div>
        <div className='flex items-end'>
          <div className='w-full p-2 flex'>
            <textarea className='form-control overflow-hidden resize-none' placeholder='Enter Thoughts Here!' rows={3} value={comment} onChange={handleChange}></textarea>
            <button type='button' className='btn btn-primary bg-bubble-gum' onClick={handleCommentSubmit}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat