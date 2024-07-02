import React, { useState } from 'react';
function UserName(){
  interface UserData {
    userName: string;
    firstName: string;
    lastName: string;
    age: number;
  }
  const [userData, setUserData] = useState<UserData>({
    userName: '',
    firstName: '',
    lastName: '',
    age: 0,
  })

  const [submitted, setSubmitted] = useState<Boolean>(false);

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

    setSubmitted(true);

  };

  if (submitted) {
    return (
      <div className="username-form">
        <h2>Thank you for submitting!</h2>
      </div>
    );
  }

  return (
    <div className="username-form">
      <h2>What should folks call you?</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User name - people see this"
          name="userName"
          value={userData.userName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          placeholder="First name - not shared"
          name="firstName"
          value={userData.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          placeholder="Last name - not shared"
          name="lastName"
          value={userData.lastName}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          placeholder="18" //this doesn't actually work for some reason, i can't override the age box React put in
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