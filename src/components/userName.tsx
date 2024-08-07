import React, { useEffect, useState } from 'react';
import io from "socket.io-client"
import { FloatingLabel, Form } from 'react-bootstrap';
import axios from 'axios';
import AnimatedLogo from './AnimatedLogo';
const socket = io("http://localhost:3000");


interface UsernameProps{
  setSignUp: (signUp: boolean) => void
}

const UserName: React.FC<UsernameProps> =  ({setSignUp}) => {
  interface UserData {
    userName: string;
    password: string
    age: number; 
  }
  const [userData, setUserData] = useState<UserData>({
    userName: '',
    password: '',
    age: 18,

  })

  const [submitted, setSubmitted] = useState<Boolean>(false);
  const [headerText, setHeaderText] = useState<string>("Login to alert Locals! ")
  useEffect(()=>{
    socket.on('connect', ()=>{
      console.log("Socket connected in username: ", socket.id);
       setUserData(prevState =>({...prevState, socketID: socket.id}));
    });

    const handleBeforeUnload = () =>{
      socket.disconnect();
    } 

    window.removeEventListener("beforeunload", handleBeforeUnload);

    return ()=>{
      socket.off('connect')
    
    }
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //need this here. If not, the whole form just reloads like it is a fresh page
    console.log(userData)
    const response = await axios.get(`http://localhost:3000/api/checkUserExists/${userData.userName}`);

    if(response.status== 200){
      if(response.data.password == userData.password){
        localStorage.setItem('username', userData.userName); //DZ testing 7.7.24
        setSubmitted(true)
        window.location.reload(); // DZ testing 7.7.24
      }
      setHeaderText("Incorrect password/username please retry")
    }

    // else{
    // await swal("Thank You for Submitting!", "Welcome to Locally📍",  "success")
    // localStorage.setItem('username', userData.userName); //DZ testing 7.7.24
    // setSubmitted(true);
    // window.location.reload(); // DZ testing 7.7.24
    // }
  };


  if (submitted) {
    return (
      <>
      </>
    );
    
  }

  const handleCreateAccount = () =>{
    setSignUp(true);
  }

  
  return (
    <>
    
    <div className="username-form" >
      <div className='flex justify-center'>
        <AnimatedLogo/>
      </div>
      <h2>{headerText}</h2>
      <form onSubmit={handleSubmit}>
        <FloatingLabel
          label="Username"
          className=''>
            <Form.Control  placeholder='Enter Username' name="userName" value={userData.userName} onChange={handleInputChange}/>
        </FloatingLabel>        
        
        <FloatingLabel
          label="Password"
          className='mt-2'>
            <Form.Control type='password' placeholder='Enter Password' name='password' value={userData.password} onChange={handleInputChange} />
        </FloatingLabel>

        <a  onClick={handleCreateAccount}>
          <label className='cursor-pointer underline pb-2'>Create Account</label>
        </a>

        <button type="submit">Submit</button>
      </form>
    </div>
    </>
    
  );
};

export default UserName;
