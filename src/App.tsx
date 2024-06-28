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

  return (
    <div  style={{ height: '100vh' }}>
      <GoogleMap />
    </div>
  )
}

export default App