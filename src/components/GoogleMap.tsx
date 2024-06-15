import React, { useState } from 'react'
import { APIProvider, Map, MapControl, ControlPosition } from '@vis.gl/react-google-maps'
import env from '../env/env'
import { CustomMapControl } from './auto-components/map-control';
import MapHandler from './auto-components/MapHandler';



export type AutocompleteMode = {id: string; label: string};
const autocompleteModes: Array<AutocompleteMode> = [
  {id: 'classic', label: 'Google Autocomplete Widget'},
  {id: 'custom', label: 'Custom Build'},
  {id: 'custom-hybrid', label: 'Custom w/ Select Widget'}
];


function GoogleMap() {
  const [selectedAutocompleteMode, setSelectedAutocompleteMode] =
    useState<AutocompleteMode>(autocompleteModes[0]);

    const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  return (
    <>
      <APIProvider apiKey={env.GOOGLE_MAPS_API_KEY}>
        <Map
          style={{width:'75vw', height: '88vh'}}
          defaultCenter={{lat:  40.730610, lng: -73.935242}}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          />
      <CustomMapControl
        controlPosition={ControlPosition.TOP}
        selectedAutocompleteMode={selectedAutocompleteMode}
        onPlaceSelect={setSelectedPlace}
      />


          <MapHandler place={selectedPlace}/>
      </APIProvider>
    </>
  )
}

export default GoogleMap