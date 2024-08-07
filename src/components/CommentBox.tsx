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
  title: string,
  icon: React.ReactNode,
}

const CommentBox: React.FC<CommentBoxProps> = ({ onClose, address, latLng }) => {

  const [dataIcon, setDataIcon] = useState<string>("PiEmptyThin")
  const [errors, setErrors] = useState({ title: '', comment: '' });
  const [userData, setUserData] = useState<UserDataFirst>({
    userName: localStorage.getItem('username'),
    address: { latLang: latLng, formatted_address: address },
    comments: [''],
    title: '',
    icon: dataIcon
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

  const validateInputs = () => {
    let isValid = true;
    let errors = { title: '', comment: '' };

    if (!userData.title) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!userData.comments[0]) {
      errors.comment = 'Comment is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmitButton = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if(validateInputs()){
      const newComment = {
        title: userData.title,
        userName: userData.userName,
        address: userData.address,
        text: userData.comments[0],
        icon: dataIcon,
        timestamp: new Date()
      };
      console.log("NEW COMMENT", newComment);
      try{
        await axios.post('http://localhost:3000/api/postComment', newComment);
        console.log("Comment Posted")
        onClose();
      }catch(error){console.error("error posting", error)}
    }
    else{
      console.log("Form is invalid")
    }

  };

  return (
    <div className='comment-class'>
      <h2>You're The First! Leave a comment</h2>
        <div className='flex justify-center'>
          <label className='text-center'>Location: {address}</label>
        </div>
      <form onSubmit={onClose}>
      {errors.title && <span className='text-red'>{errors.title}</span>}
          <input
            required
            type="text"
            name='title'
            placeholder='Enter a title! *'
            value={userData.title}
            onChange={handleInputChange}
          />
          {errors.comment && <span className='text-red'>{errors.comment}</span>}
          <input
            required
            type="text"
            name="comment"
            placeholder="Enter a comment! *"
            value={userData.comments[0]}
            onChange={(e) => handleCommentChange(e, 0)}
          />

        <DropDown onIconSelect={setDataIcon}/>
        <button type="submit" onClick={handleSubmitButton}>Submit Comment</button>
        <button type="button" className='hide-comment-button' onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CommentBox;
