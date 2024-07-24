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
    hour12: true,
  };
  return date.toLocaleString('en-US', options).replace(',', ' @');
}

interface ChatProps {
  usernameStored: string | null;
  address?: string;
  lat?: number;
  lng?: number;
}

const Chat: React.FC<ChatProps> = ({ usernameStored, address, lat, lng }) => {
  const [comment, setComment] = useState<string>('');
  const [docs, setDocs] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const endOfMessagesRef = useRef<HTMLLIElement | null>(null);
  const [isChatVisible, setIsChatVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/getPosts`);
        if (Array.isArray(response.data)) {
          setDocs(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

    socketRef.current = io('http://localhost:3000');
    socketRef.current.on('connect', () => {
      console.log('SOCKET CONNECTED: ', socketRef.current?.id);
    });

    socketRef.current.on('Comment', (newComment) => {
      console.log('New comment received:', newComment);
      setDocs((prevDocs) => {
        const updatedDocs = [...prevDocs];
        const existingDocIndex = updatedDocs.findIndex(doc => doc.address.formatted_address === newComment.address.formatted_address);
        if (existingDocIndex !== -1) {
          // Add new comment to the existing document
          updatedDocs[existingDocIndex].comments.push(newComment.comments[0]);
        } else {
          // If the document does not exist, add it to the docs array
          updatedDocs.push(newComment);
        }
        return updatedDocs;
      });
      scrollToBottom();  // Scroll to bottom when a new comment is received
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('Comment');
        socketRef.current.disconnect();
      }
    };
  }, [lat, lng]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const newComment = {
        address: {
          latLang: { lat, lng },
          formatted_address: address
        },
        userName: usernameStored,
        text: comment,
        timestamp: new Date()
      };
      await axios.post('http://localhost:3000/api/postComment', newComment);
      setComment(''); // Clears input box after sending
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const scrollToBottom = () => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHideChat = () => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.style.opacity = '0';
      setTimeout(() => {
        setIsChatVisible(false); // This changes the class to hidden, applying visibility: hidden;
      }, 150); // This should match the duration of the CSS transition
    }
  };

  const handleShowChat = () => {
    setIsChatVisible(true); // This will remove the 'hidden' class and add 'visible'
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer) {
        chatContainer.style.opacity = '1';
      }
    }, 10); // Small delay to ensure the class change has taken effect
  };

  return (
    <div>
      <div className={`chat-container ${isChatVisible ? 'visible' : 'hidden'}`}>
        <div className='chat-header'>
          <div className='header-text'>
            Chat Locally
            <button className='hide-chat-button' onClick={handleHideChat}>
              <i className='bi bi-x-circle'></i>
            </button>
          </div>
        </div>
        <div>
          <ul className='chat-box'>
            {docs.flatMap((doc, docIndex) =>
              doc.comments.map((comment, commentIndex) => (
                <li key={`${docIndex}-${commentIndex}`} className={comment.userName === usernameStored ? 'user-message' : ''}>
                  <div className='chat-message'>
                    <div className='user-name'>
                      {comment.userName}:
                    </div>
                    <div className='chat-content'>
                      {comment.text}
                    </div>
                    <p className='time-stamp'>{formatTimestamp(comment.timestamp)}</p>
                  </div>
                </li>
              ))
            )}
            <div ref={endOfMessagesRef}></div>
          </ul>
          <div className='text-center block'>
            <label className='text-white'>Add Comment To:</label>
            <label className='text-white'>{address}</label>
          </div>
          <div className='input-container'>
            <textarea className='input-field resize-none' placeholder='Enter Thoughts Here!' value={comment} onChange={handleChange}></textarea>
            <button type='button' className='send-button' onClick={async (event) => { await handleCommentSubmit(event); scrollToBottom(); }}>
              <i className='bi bi-arrow-up'></i>
            </button>
          </div>
        </div>
      </div>
      {!isChatVisible && (
        <button className='show-chat-button' onClick={handleShowChat}>
          <i className='bi bi-chat-right-text'></i>
        </button>
      )}
    </div>
  );
};

export default Chat;
