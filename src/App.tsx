import { Container, Row, Col } from "react-bootstrap"
import GoogleMap from "./components/GoogleMap"
import Header from "./components/Header"
import Chat from "./components/Chat"
import OpenData from "./components/OpenData"
import React, { useState } from 'react'
import firebase from 'firebase/app'
import './App.css'
import axios from 'axios';
import UserName from './components/userName';


export type AutocompleteMode = {id: string; label: string};

function App() {
  const [userExists, setUserExists] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    age: 0,
  });
  //Need to write code to check to see if user already exists, if so, we don't want create profile popping up
  const handleUserNameSubmit = (newUsername: any) => {
    setUsername(newUsername); //we need to send this to the backend eventually
    setUserExists(true); // User now exists - need to write routine to handle if user already exists.
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    console.log(place); // Just logging for now, adjust as needed
  };

  return (

    <div  style={{ height: '100vh' }}>
      {/*<Header onPlaceSelect={handlePlaceSelect} />*/} {/*DZ 6.29.24: this line was messing up the Google Maps Auto Fill and Search - SEE GOOGLEMAPS.TSX LINE 30*/}
      <UserName />
      <GoogleMap />
    </div>
  )

}

export default App
