import React from 'react';
import UserName from './userName';

interface CommentBoxProps {
  lat: number;
  lng: number;
}

const CommentBox: React.FC<CommentBoxProps> = ({ lat, lng }) => {
  return (
    <div className = "comment-class">
      <h2>"Comment Title Here"</h2>
      <form /*{onSubmit = {handleSubmit}}*/>
      <input
        type = "text"
        placeholder='Title'
        
      />
      <textarea
        className='w-[10vw]'
        placeholder='Enter your Comment!'
        
      />
      <p>Latitude: {lat}</p>
      <p>Longitude: {lng}</p>
      <button type = "Submit">Submit Comment</button>
      </form>
    </div>
  );
};

export default CommentBox;
