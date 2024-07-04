import React, { useEffect, useState } from 'react';
import swal from 'sweetalert'
import io from "socket.io-client"
import FormRange from 'react-bootstrap/FormRange'
import { Form } from 'react-bootstrap';
const socket = io("http://localhost:3000");

function UserName (){
  interface UserData {
    userName: string;
    firstName: string;
    lastName: string;
    age: number;
    socketID: string | undefined; 
  }
  const [userData, setUserData] = useState<UserData>({
    userName: '',
    firstName: '',
    lastName: '',
    age: 0,
    socketID: "",
  })

  const [submitted, setSubmitted] = useState<Boolean>(false);


  useEffect(()=>{
    socket.on('connect', ()=>{
      console.log("Socket connected in username: ", socket.id);
       setUserData(prevState =>({...prevState, socketID: socket.id}));
    });

    return ()=>{socket.off('connect')}
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //need this here. If not, the whole form just reloads like it is a fresh page
    console.log(userData)
    await fetch('http://localhost:3000/api/postData', {
      method: 'POST',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify(userData)
    })

    await swal("Thank You for Submitting!", "Welcome to Locally📍",  "success")
    setSubmitted(true);
  };


  if (submitted) {
    return (
      <>
      </>
    );
    
  }

  
  return (
    <div className="username-form" >
      <h2>What should folks call you?</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="userName"
          value={userData.userName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={userData.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={userData.lastName}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          placeholder="18" //this doesn't actually work for some reason, i can't override the age box React put in
          id="typeNumber"
          name="age"
          value={userData.age}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>

    
  );
};

export default UserName;