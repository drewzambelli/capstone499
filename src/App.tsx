import React from "react"
import { APIProvider, Map } from "@vis.gl/react-google-maps"
import NavbarLocal from "./components/NavbarLocal"
import env from "./env/env"
function App() {
  return (
    <APIProvider apiKey={env.GOOGLE_MAPS_API_KEY}>
      <NavbarLocal/>
      <Map
        style={{width:'100vw', height: '100vh'}}
        defaultCenter={{lat:  40.730610, lng: -73.935242}}
        defaultZoom={12}
        gestureHandling={'greedy'}
        disableDefaultUI={true}/>
    </APIProvider>
  )
}

export default App
//