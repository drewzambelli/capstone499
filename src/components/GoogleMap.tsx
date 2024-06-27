import React, { useState, useEffect } from 'react'
import { APIProvider, Map, MapControl, ControlPosition, Marker } from '@vis.gl/react-google-maps'
import env from '../env/env'
import { CustomMapControl } from './auto-components/map-control';
import MapHandler from './auto-components/MapHandler';
import IMAGES from './img/images'


export type AutocompleteMode = {id: string; label: string};
const autocompleteModes: Array<AutocompleteMode> = [
  {id: 'classic', label: 'Google Autocomplete Widget'},
  {id: 'custom', label: 'Custom Build'},
  {id: 'custom-hybrid', label: 'Custom w/ Select Widget'}
];
//Original key  apiKey={env.GOOGLE_MAPS_API_KEY}   Drew KEY: ************************* put this in apiKey value as string
function GoogleMap() {
  const [selectedAutocompleteMode, setSelectedAutocompleteMode] =
    useState<AutocompleteMode>(autocompleteModes[0]);

    const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
    //userLocation will attempt to get the user's location so the map opens there
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 40.730610, lng: -73.935242 });

    //If we can get user's location, open there. If not, default to hardcoded NYC coordinates
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          error => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }, []);

    return (
      <> 
        <APIProvider apiKey= {env.GOOGLE_MAPS_API_KEY} >
          <Map
            style={{ width: '75vw', height: '75vh' }}
            defaultCenter={userLocation} // Center on user's location if available
            defaultZoom={19}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
            <Marker 
              position={userLocation}
              icon={IMAGES.icon}
              />
          </Map>
          <CustomMapControl
            controlPosition={ControlPosition.TOP}
            selectedAutocompleteMode={selectedAutocompleteMode}
            onPlaceSelect={setSelectedPlace}
          />
          <MapHandler place={selectedPlace} />
        </APIProvider>
      </>
    );
  }

export default GoogleMap