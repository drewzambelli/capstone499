import axios from 'axios';
import { useState } from 'react';
import DropDown from './DropDown';

interface CommentBoxProps {
  onClose: () => void;
  address: string;
  latLng: { lat: number; lng: number };
}

interface UserDataFirst {
  userName: string | null,
  address: { latLang: { lat: number, lng: number }, formatted_address: string },
  comments: string[],
  title: string
}

const CommentBox: React.FC<CommentBoxProps> = ({ onClose, address, latLng }) => {

  const [userData, setUserData] = useState<UserDataFirst>({
    userName: localStorage.getItem('username'),
    address: { latLang: latLng, formatted_address: address },
    comments: [''],
    title: ''
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;
    setUserData((prevData) => {
      const updatedComments = [...prevData.comments];
      updatedComments[index] = value;
      return { ...prevData, comments: updatedComments };
    });
  };

  const handleSubmitButton = async () => {
    const newComment = {
      userName: userData.userName,
      address: userData.address,
      text: userData.comments[0],
      timestamp: new Date()
    };
    // console.log("NEW COMMENT", newComment);
    await axios.post('http://localhost:3000/api/postComment', newComment);
  };

  return (
    <div className='comment-class'>
      <h2>You're The First! Leave a comment</h2>
        <div className='flex justify-center'>
          <label className='text-center'>Location: {address}</label>
        </div>
      <form onSubmit={onClose}>
    
          <input
            type="text"
            name='title'
            placeholder='Title'
            value={userData.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="comment"
            placeholder="Enter a comment!"
            value={userData.comments[0]}
            onChange={(e) => handleCommentChange(e, 0)}
          />
        <DropDown/>
        <button type="submit" onClick={handleSubmitButton}>Submit Comment</button>
        <button type="button" className='hide-comment-button' onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CommentBox;
