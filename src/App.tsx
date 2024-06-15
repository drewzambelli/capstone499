import { Container, Row, Col } from "react-bootstrap"
import GoogleMap from "./components/GoogleMap"
import Header from "./components/Header"
import Chat from "./components/Chat"
import { useState } from "react";

export type AutocompleteMode = {id: string; label: string};
const autocompleteModes: Array<AutocompleteMode> = [
  {id: 'classic', label: 'Google Autocomplete Widget'},
  {id: 'custom', label: 'Custom Build'},
  {id: 'custom-hybrid', label: 'Custom w/ Select Widget'}
];

function App() {

  return (
    <div className="">
      <Header/>
      <Container fluid className="">
        <Row >
          <Col className="p-0 flex ">
            <GoogleMap/>
            <Chat/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App