import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import env from '../env/env';
import Header from './Header'; // Make sure this path is correct
import MapHandler from './auto-components/MapHandler';
import IMAGES from './img/images';

function GoogleMap() {
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 40.730610, lng: -73.935242 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
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
      <APIProvider apiKey={env.GOOGLE_MAPS_API_KEY}>
        <Header onPlaceSelect={setSelectedPlace} />
        <Map
          className='map-class'
          defaultCenter={userLocation}
          defaultZoom={19}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <Marker 
            position={userLocation}
            icon={IMAGES.icon}
          />
        </Map>
        <MapHandler place={selectedPlace} />
      </APIProvider>
    </>
  );
}

export default GoogleMap;
