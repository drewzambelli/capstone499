import React from "react"
import { APIProvider, Map } from "@vis.gl/react-google-maps"
import NavbarLocal from "./components/NavbarLocal"
import env from "./env/env"
import MainLocal from "./components/GoogleMap"
import GoogleMap from "./components/GoogleMap"
import Header from "./components/Header"

function App() {
  return (
    <>
      <Header/>
      <GoogleMap>
        <div></div>
      </GoogleMap>
    </>
  )
}

export default App