import React, { useState } from 'react';
import swal from 'sweetalert'
import { FloatingLabel, Form } from 'react-bootstrap';

interface SignUpProps{
    setSignUp: (signUp: boolean) =>void;
}

const SignUp: React.FC<SignUpProps> = ({setSignUp}) => {
    interface UserData {
        userName: string;
        password: string;
        age: number;
    }

    const [userData, setUserData] = useState<UserData>({
        userName: '',
        password: '',
        age: 18,
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevents the form from reloading
        console.log(userData);
        const response = await fetch('http://localhost:3000/api/postData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            console.log("USER TAKEN");
        } else {
            console.log("GOOD")
            await swal("Thank You for Submitting!", "Welcome to Locally📍", "success");
            localStorage.setItem('username', userData.userName); // DZ testing 7.7.24
            window.location.reload(); // DZ testing 7.7.24
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };
    const handleCreateAccount = () =>{
        setSignUp(false);
      }
    

    return (
        <div className="username-form">
            <h2>Create An Account!</h2>
            <form onSubmit={handleSubmit}>
            <FloatingLabel
                label="Enter New Username"
                className=''>
                    <Form.Control  placeholder='Enter Username' name="userName" value={userData.userName} onChange={handleInputChange}/>
            </FloatingLabel>        
        
            <FloatingLabel
                label="Enter New Password"
                className='my-2'>
                    <Form.Control type='password' placeholder='Enter New Password' name='password' value={userData.password} onChange={handleInputChange} />
            </FloatingLabel>


            <a  onClick={handleCreateAccount}>
                <label className='cursor-pointer underline pb-2'>Already have an account?</label>
            </a>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SignUp;
