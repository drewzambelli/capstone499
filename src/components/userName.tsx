import React, { useState } from 'react';

interface UserNameProps {
  onUserDataSubmit: (userData: UserData) => void;
}

interface UserData {
  username: string;
  firstName: string;
  lastName: string;
  age: number;
}

const UserName: React.FC<UserNameProps> = ({ onUserDataSubmit }) => {
  const [userData, setUserData] = useState<UserData>({
    username: '',
    firstName: '',
    lastName: '',
    age: 0,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //need this here. If not, the whole form just reloads like it is a fresh page
    onUserDataSubmit(userData);
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
          name="username"
          value={userData.username}
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