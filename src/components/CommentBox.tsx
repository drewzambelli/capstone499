import axios from 'axios';
import { useState } from 'react';

interface CommentBoxProps {
  onClose: () => void;
  address: string;
}

interface UserDataFirst {
  userName: string | null,
  address: string,
  comments: string[],
  title: string
}

const CommentBox: React.FC<CommentBoxProps> = ({ onClose, address }) => {

  const [userData, setUserData] = useState<UserDataFirst>({
    userName: localStorage.getItem('username'),
    address: address,
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
      address: address,
      text: userData.comments[0],
      timestamp: new Date()
    };

    await axios.post('http://localhost:3000/api/postComment', newComment);
  };

  return (
    <div className='comment-class'>
      <h2>You're The First! Leave a comment</h2>
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
        <button type="submit" onClick={handleSubmitButton}>Submit Comment</button>
        <button type="button" className='hide-comment-button' onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CommentBox;
