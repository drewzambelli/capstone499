import React from 'react';

interface CommentBoxProps {
  lat: number;
  lng: number;
  onClose: () => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ lat, lng, onClose}) => {
  return (
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
      </form>
    </div>
  );
};

export default CommentBox;
