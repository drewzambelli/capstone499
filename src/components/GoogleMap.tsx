import { useState, useEffect } from 'react';
import { APIProvider, InfoWindow, Map, Marker } from '@vis.gl/react-google-maps';
import env from '../env/env';
import Header from './Header'; // Make sure this path is correct
import MapHandler from './auto-components/MapHandler';
import IMAGES from './img/images';
import axios from 'axios';

interface GoogleMapProps {
  onDoubleClick: (lat: number, lng: number) => void; 
  onMarkerClick: (lat:number, lng: number) => void;

}

const GoogleMap: React.FC<GoogleMapProps> = ({ onDoubleClick, onMarkerClick }) => { // <-- MODIFY THIS
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 40.730610, lng: -73.935242 });
  const [commentPosition, setCommentPosition] = useState<{ lat: number; lng: number } | null>(null); // <-- State for the CommentBox position
  const [markers, setMarkers] = useState<Array<{lat: number; lng: number}>>([]);
  const [hoveredMarker, setHoveredMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');

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


  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/getPosts'); // Fetch all comments
        const fetchedMarkers = result.data.flatMap((item: any) => item.address.latLang);
        setMarkers(fetchedMarkers);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };
  
    fetchMarkers();
  }, []); // Fetch markers when the component mounts
  

  const handleDoubleClick = async (event: google.maps.MapMouseEvent) => { // <-- ADD THIS
    console.log('double click routine', event); //testing
    const latLng = (event as any).detail?.latLng; // DO NOT DELETE
    console.log('latLng:', latLng)
    if (latLng) {
      const lat = latLng.lat;
      const lng = latLng.lng;
      console.log('Coordinates:', lat, lng); // testing
      onDoubleClick(lat, lng);
      // setCommentPosition({ lat, lng });
      setMarkers((prevMarkers) => [...prevMarkers, {lat,lng}]);

    } else {
      console.log('No latLng found in event', event); // testing
    }
  };

  const getAllLocations = async () => {
    const result = await axios.get(`http://localhost:3000/api/getAllLatLong`);
    for(let i = 0; i < result.data.length; i++){
      console.log(result.data[i].address.latLang);
    }
  }


  const handleMouseOverMarker = async (marker : {lat: number; lng: number}) =>{
    setHoveredMarker(marker);
    const address = await axios.get(`http://localhost:3000/api/getLocationAddress/lng=${marker.lng}/lat=${marker.lat}`);
    setAddress(address.data.formatted_address);
  }
  const handleMouseOut = () => {
    setHoveredMarker(null);
    setAddress('');
  };

  const handleMarkerClick = (marker: {lat: number; lng: number}) =>{
    onMarkerClick(marker.lat, marker.lng);
  }

  return (
    <> 
      <APIProvider apiKey={env.GOOGLE_MAPS_API_KEY}> 
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
          {/* <Marker 
            position={userLocation}
            icon={IMAGES.icon}
          /> */}
          {hoveredMarker && (
            <InfoWindow
            options={{ pixelOffset: new google.maps.Size(0, -30) }}
            onCloseClick={handleMouseOut}
            position={{lat: hoveredMarker.lat, lng: hoveredMarker.lng}}
            >
              <div className='p-2 text-sm leading-tight'>{address}</div>
            </InfoWindow>
          )}
          {markers.map((marker, index) =>(
            <Marker
            key={index}
            position ={{lat: marker.lat, lng: marker.lng}}
            icon={IMAGES.icon}
            onMouseOver={() => handleMouseOverMarker(marker)}
            />
          ))}


        </Map>
        <MapHandler place={selectedPlace} />
      </APIProvider>
    </>
  );
}

export default GoogleMap;
