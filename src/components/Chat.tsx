import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const options = {
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
  const [docs, setDocs] = useState([]);
  const socketRef = useRef<Socket | null>(null);
  const [isChatVisible, setIsChatVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getPosts');
        if (Array.isArray(response.data)) {
          setDocs(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    socketRef.current = io('http://localhost:3000');
    socketRef.current.on('connect', () => {
      console.log("SOCKET CONNECTED: ", socketRef.current?.id);
    });

    socketRef.current.on('Comment', (item) => {
      setDocs((prevDocs) => Array.isArray(prevDocs) ? [...prevDocs, item] : [item]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('Comment');
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/postComment', {
        username: "Anonymous",
        text: comment
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  return (
    <div>
      <div className={`chat-container ${!isChatVisible ? 'hidden' : ''}`}>
        <div className='chat-header'>
          <div className='header-text'>
            Chat Locally
            <button className="hide-chat-button" onClick={() =>{console.log('Hiding chat'); setIsChatVisible(false);}}>
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
        </div>
        <div>
          <ul className='chat-box'>
            {docs.map((doc) => (
              <li key={doc._id}>
                <strong>{doc.username}: </strong>{doc.text}
                <p>{formatTimestamp(doc.timestamp)}</p>
              </li>
            ))}
          </ul>
          <div className='input-container'>
            <textarea className='input-field' placeholder='Enter Thoughts Here!' rows={3} value={comment} onChange={handleChange}></textarea>
            <button type='button' className='send-button' onClick={handleCommentSubmit}>
              <i class="bi bi-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
      {!isChatVisible && (
        <button className="show-chat-button" onClick={() => {
          console.log('Showing chat');
          setIsChatVisible(true);
        }}>
          <i className="bi bi-chat-right-text"></i>
          
        </button>
      )}
    </div>
  );
}

export default Chat;
