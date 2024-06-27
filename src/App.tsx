import { Container, Row, Col } from "react-bootstrap"
import GoogleMap from "./components/GoogleMap"
import Header from "./components/Header"
import Chat from "./components/Chat"
import OpenData from "./components/OpenData"
import { useState } from "react";
import firebase from 'firebase/app'


export type AutocompleteMode = {id: string; label: string};

function App() {

  return (
    <div className="">
      <Header/>
      <Container fluid className="h-]">
        <Row  className="h-full">
          <Col className="p-0 flex ">
          <Chat/>
          <div>
            <GoogleMap/>
            <OpenData/>
          </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App