import { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import env from '../env/env';
import Header from './Header'; // Make sure this path is correct
import MapHandler from './auto-components/MapHandler';
import IMAGES from './img/images';

interface GoogleMapProps {
  onDoubleClick: (lat: number, lng: number) => void; // <-- ADD THIS
}

const GoogleMap: React.FC<GoogleMapProps> = ({ onDoubleClick }) => { // <-- MODIFY THIS
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 40.730610, lng: -73.935242 });
  const [commentPosition, setCommentPosition] = useState<{ lat: number; lng: number } | null>(null); // <-- State for the CommentBox position


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

  const handleDoubleClick = (event: google.maps.MapMouseEvent) => { // <-- ADD THIS
    console.log('double click routine', event); //testing
    const latLng = (event as any).detail?.latLng; // DO NOT DELETE
    console.log('latLng:', latLng)
    if (latLng) {
      const lat = latLng.lat;
      const lng = latLng.lng;
      console.log('Coordinates:', lat, lng); // testing
      onDoubleClick(lat, lng);
      setCommentPosition({ lat, lng });


    } else {
      console.log('No latLng found in event', event); // testing
    }
  };

  return (
    <> 
      <APIProvider apiKey={env.GOOGLE_MAPS_API_KEY}> {/*{env.GOOGLE_MAPS_API_KEY}>*/}
      <Header onPlaceSelect={setSelectedPlace} /> {/*DZ - 6.29.24: THIS LINE CREATES THE HEADER WHICH ACTUALLY WORKS WITH AUTOCOMPLETE/SEARCH */}
        <Map
          className='map-class'
          defaultCenter={userLocation}
          defaultZoom={19}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          options={{ disableDoubleClickZoom: true }}
          onDblclick = {handleDoubleClick} 
        >
          <Marker 
            position={userLocation}
            icon={IMAGES.icon}
          />
          <Marker
           position ={commentPosition}
           icon={IMAGES.icon}
           />
        </Map>
        <MapHandler place={selectedPlace} />
      </APIProvider>
    </>
  );
}

export default GoogleMap;
