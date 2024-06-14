import { Container, Row, Col } from "react-bootstrap"
import GoogleMap from "./components/GoogleMap"
import Header from "./components/Header"
import Chat from "./components/Chat"
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