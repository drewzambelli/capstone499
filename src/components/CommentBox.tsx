import React from 'react';

interface CommentBoxProps {
  lat: number;
  lng: number;
}

const CommentBox: React.FC<CommentBoxProps> = ({ lat, lng }) => {
  return (
    <div className = "comment-class">
      <h2>"Leave a Comment"</h2>
      <form /*{onSubmit = {handleSubmit}}*/>
      <input
        type = "text"
        
      />
      <input
        type = "text"
        
      />
      <input
        type = "text"
        
      />
      <input
        type = "text"
        
      />
      <p>Latitude: {lat}</p>
      <p>Longitude: {lng}</p>
      <button type = "Submit">Submit Comment</button>
      </form>
    </div>
  );
};

export default CommentBox;
