import { Container, Row, Col } from "react-bootstrap"
import GoogleMap from "./components/GoogleMap"
import Header from "./components/Header"
import Chat from "./components/Chat"
import OpenData from "./components/OpenData"
import React, { useState, useEffect } from 'react' //DZ testing, added useEffect
import firebase from 'firebase/app'
import './App.css'
import UserName from './components/userName';
import 'bootstrap-icons/font/bootstrap-icons.css';



export type AutocompleteMode = {id: string; label: string};

function App() {
  //Need to write code to check to see if user already exists, if so, we don't want create profile popping up
  // const handleUserNameSubmit = (newUsername: any) => {
  //   setUsername(newUsername); //we need to send this to the backend eventually
  //   setUserExists(true); // User now exists - need to write routine to handle if user already exists.
  // };
  const [userExists, setUserExists] = useState(false);
  const [storedUsernames, setStoredUsername] = useState<string | null>('');

  // START CHECK IF USER ALREADY EXISTS
  const checkUserExists = async () => {
    const storedUsername = localStorage.getItem('username');
    setStoredUsername(storedUsername);
    if (storedUsername) {
      try {
        const response = await fetch(`http://localhost:3000/api/checkUserExists/${storedUsername}`);
        if (response.status === 200) {
          setUserExists(true);
        } else {
          setUserExists(false);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setUserExists(false);
      }
    }
  };


  useEffect(() => {
    checkUserExists();
  }, []);
 //END CHECK IF USER ALREADY EXISTS

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    console.log(place); // Just logging for now, adjust as needed
  };


  return (

    <div  style={{ height: '100vh' }}>
      {/*<Header onPlaceSelect={handlePlaceSelect} />*/} {/*DZ 6.29.24: this line was messing up the Google Maps Auto Fill and Search - SEE GOOGLEMAPS.TSX LINE 30*/}
      {!userExists && <UserName />}
      {userExists && (
        <>
          <GoogleMap /> 
          {/*7.6.24 - DARIEL, COMMENT THIS LINE OUT TO SEE THE COMMENTS SECTION APPEAR THAT YOU WROTE*/}
          <Chat  usernameStored={storedUsernames}/>
        </>
      )}
    </div>
  )

}

export default App
