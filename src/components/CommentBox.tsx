import React from 'react';

interface CommentBoxProps {
  lat: number;
  lng: number;
  onClose: () => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ lat, lng, onClose}) => {
  return (
<<<<<<< HEAD
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
=======
    <div className='comment-class'>      
      <h2>Leave a Comment!</h2>
      <form /*{onSubmit = {handleSubmit}}*/>
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <p>Latitude: {lat}</p>
        <p>Longitude: {lng}</p>
        <button type="submit">Submit Comment</button>
        <button onClick={onClose} className='hide-comment-button'>
          Cancel
        </button>
>>>>>>> 5564df5b430958dc8ed5ecaad183ab7fc675a741
      </form>
    </div>
  );
};

export default CommentBox;
