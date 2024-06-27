import { Container, Row, Col } from "react-bootstrap"
import GoogleMap from "./components/GoogleMap"
import Header from "./components/Header"
import Chat from "./components/Chat"
<<<<<<< HEAD
import OpenData from "./components/OpenData"
import { useState } from "react";
import firebase from 'firebase/app'


export type AutocompleteMode = {id: string; label: string};
=======
import { useState } from "react";

export type AutocompleteMode = {id: string; label: string};
const autocompleteModes: Array<AutocompleteMode> = [
  {id: 'classic', label: 'Google Autocomplete Widget'},
  {id: 'custom', label: 'Custom Build'},
  {id: 'custom-hybrid', label: 'Custom w/ Select Widget'}
];
>>>>>>> origin/dev

function App() {

  return (
    <div className="">
      <Header/>
<<<<<<< HEAD
      <Container fluid className="h-]">
        <Row  className="h-full">
          <Col className="p-0 flex ">
          <Chat/>
          <div>
            <GoogleMap/>
            <OpenData/>
          </div>
=======
      <Container fluid className="">
        <Row >
          <Col className="p-0 flex ">
            <GoogleMap/>
            <Chat/>
>>>>>>> origin/dev
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App