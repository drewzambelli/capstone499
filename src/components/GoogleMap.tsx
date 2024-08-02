import { useState, useEffect } from 'react';
import { APIProvider, InfoWindow, Map, MapMouseEvent, Marker } from '@vis.gl/react-google-maps';
import env from '../env/env';
import Header from './Header'; 
import MapHandler from './auto-components/MapHandler';
import IMAGES from './img/images';
import axios from 'axios';
import CrimeBox from './crime';

interface GoogleMapProps {
  onDoubleClick: (lat: number, lng: number) => void; 
  onMarkerClick: (lat:number, lng: number) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ onDoubleClick, onMarkerClick }) => { // <-- MODIFY THIS
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null); /*{ lat: 40.730610, lng: -73.935242 }*/
  const [commentPosition, setCommentPosition] = useState<{ lat: number; lng: number } | null>(null); // <-- State for the CommentBox position
  const [markers, setMarkers] = useState<Array<{lat: number; lng: number}>>([]);
  const [hoveredMarker, setHoveredMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [currentCenter, setCurrentCenter] = useState<{lat:number; lng:number} | null>({});  // Default Hunter College



  //function to open map roughly where user is (if you are hard-wired to internet on desktop, the location is likely wherever your ISP routed through)
  useEffect(() => {
    if (navigator.geolocation) {
      //console.log("we just entered navigator IF statement") //for testing
      navigator.geolocation.getCurrentPosition(
        position => {
          //console.log('in navigator thing') //for testing
          //const lat = position.coords.latitude;
          //const lng = position.coords.longitude;
          //console.log('Latitude:', lat); // Print latitude to console
          //console.log('Longitude:', lng); // Print longitude to console
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setCurrentCenter ({ lat: position.coords.latitude, lng: position.coords.longitude })
          // console.log(userLocation);
        },
        error => {
          //This if statement is to tell you why we aren't opening site at your location - in case user
          //accidentally hasn't allowed geolocation for the site/accidentally clicked 'block'
          if (error.code === error.PERMISSION_DENIED) {
            console.error('Error getting user location: User denied Geolocation');
            alert('Location access is required to show your current location on the map. Please allow location access in your browser settings.');
          } else {
            console.error('Error getting user location:', error);
          }
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
  

  const handleDoubleClick = async (event:MapMouseEvent) => { // <-- ADD THIS
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

  const handleDragStart = () =>{
    console.log("Being Dragged Start");
  }

  const handleDragEnd = async (map:google.maps.Map) => {
    console.log("Being Dragged End");
    const center = map.getCenter();
    if (center) {
      const lat = center.lat();
      const lng = center.lng();
      console.log("Map center after drag:", { lat, lng });
      setCurrentCenter({ lat, lng });  // Update state with new center
      const result = await axios.get(`http://localhost:3000/api/getLocationAddress/lng=${lng}/lat=${lat}`);
      console.log(result.data.address_components[3].long_name);
    }
  }
  return (
    <> 
      <APIProvider apiKey={env.GOOGLE_MAPS_API_KEY}> 
      <Header onPlaceSelect={setSelectedPlace} /> {/*DZ - 6.29.24: THIS LINE CREATES THE HEADER WHICH ACTUALLY WORKS WITH AUTOCOMPLETE/SEARCH */}
        <Map
          className='map-class'
          defaultCenter={userLocation as google.maps.LatLngAltitudeLiteral}
          defaultZoom={19} //if we don't have defaultZoom, zoom goes haywire and opens at global level
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          options={{ disableDoubleClickZoom: true }}
          onDblclick = {handleDoubleClick} 
          onDragstart={handleDragStart}
          onDragend={(event)=> handleDragEnd(event.map)}
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
            <div className='relative'>
              <Marker
              key={index}
              position ={{lat: marker.lat, lng: marker.lng}}
              icon={IMAGES.icon}
              onMouseOver={() => handleMouseOverMarker(marker)}
              />
            </div>
          ))}


        </Map>
        <MapHandler place={selectedPlace} />
        <CrimeBox address="" lat={currentCenter.lat} lng={currentCenter.lng} />

      </APIProvider>
    </>
  );
}

export default GoogleMap;
