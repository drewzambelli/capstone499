import React from 'react';

interface CommentBoxProps {
  lat: number;
  lng: number;
}

const CommentBox: React.FC<CommentBoxProps> = ({ lat, lng }) => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        // top: `${lat}px`,
        // left: `${lng}px`,
        backgroundColor: 'pink',
        padding: '10px',
        borderRadius: '5px',
      }}
    >
      <p>Latitude: {lat}</p>
      <p>Longitude: {lng}</p>
    </div>
  );
};

export default CommentBox;
