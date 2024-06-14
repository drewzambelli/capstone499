import React from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import env from '../env/env'
import NavbarLocal from './NavbarLocal'
import Header from './Header'

export interface MainProps{
  children: React.ReactNode
}


function GoogleMap(props: MainProps) {
  return (
    <>
      <APIProvider apiKey={env.GOOGLE_MAPS_API_KEY}>
        <Map
          style={{width:'100vw', height: '100vh'}}
          defaultCenter={{lat:  40.730610, lng: -73.935242}}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={true}/>
        {props.children}
      </APIProvider>
    </>
  )
}

export default GoogleMap