import { Container, Row, Col } from "react-bootstrap"
import GoogleMap from "./components/GoogleMap"
import Header from "./components/Header"
import Chat from "./components/Chat"
import OpenData from "./components/OpenData"
import React, { useState } from 'react'
import firebase from 'firebase/app'
import './App.css'


export type AutocompleteMode = {id: string; label: string};

function App() {

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    // Logic to handle selected place
    console.log(place); // Just logging for now, adjust as needed
  };

  return (
    <div  style={{ height: '100vh' }}>
      <Header onPlaceSelect={handlePlaceSelect} />
      <GoogleMap />
    </div>
  )
}

export default App