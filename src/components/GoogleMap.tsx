import React, { useState } from 'react'
import { APIProvider, Map, MapControl, ControlPosition } from '@vis.gl/react-google-maps'
import env from '../env/env'
import PlaceAutocomplete from '../PlaceAutocomplete';


function GoogleMap() {
  const [selectedPlace , setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  return (
    <>
      <APIProvider apiKey={env.GOOGLE_MAPS_API_KEY}>
        <Map
          style={{width:'75vw', height: '100vh'}}
          defaultCenter={{lat:  40.730610, lng: -73.935242}}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          className=''/>
        <MapControl position={ControlPosition.TOP}>
          <div className='autocomplete-control'>
            <PlaceAutocomplete onPlaceSelect={setSelectedPlace}/>
          </div>
        </MapControl>
      </APIProvider>
    </>
  )
}

export default GoogleMap