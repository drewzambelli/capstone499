import GoogleMap from "./components/GoogleMap"
import Chat from "./components/Chat"
import { useState, useEffect } from 'react'
import './App.css'
import UserName from './components/userName';
import CommentBox from './components/CommentBox';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios"
import Account from "./components/Account";
import CrimeBox from './components/crime';

export type AutocompleteMode = { id: string; label: string };

function App() {
  const [userExists, setUserExists] = useState(false);
  const [storedUsernames, setStoredUsername] = useState<string | null>('');
  const [commentPosition, setCommentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [locationTaken, setLocationTaken] = useState<boolean>(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false); // DZ WAS HERE: Added state for panning
  const [mapInstance, setMapInstance] = useState<any>(null); // DZ WAS HERE: Added state for map instance

  const checkUserExists = async () => {
    const storedUsername = localStorage.getItem('username');
    setStoredUsername(storedUsername);
    if (storedUsername) {
      try {
        const response = await fetch(`http://localhost:3000/api/checkUserExists/${storedUsername}`);
        if (response.status === 200) {
          setUserExists(true);
        } else {
          setUserExists(false);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setUserExists(false);
      }
    }
  };

  const checkLocationExists = async (lat: number, lng: number) => {
    const result = await axios.get(`http://localhost:3000/api/getLocationAddress/lng=${lng}/lat=${lat}`);
    const address = result.data.address;
    try {
      let locationExist = await axios.get(`http://localhost:3000/api/checkComment/address=${address}`);
      if (locationExist.data.address === null) {
        setLocationTaken(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    checkUserExists();
  }, []);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    console.log(place); // Just logging for now, adjust as needed
  };

  const handleMapDoubleClick = async (lat: number, lng: number) => {
    checkLocationExists(lat, lng);
    setCommentPosition({ lat, lng });
    let result = await axios.get(`http://localhost:3000/api/getLocationAddress/lng=${lng}/lat=${lat}`);
    setAddress(result.data.formatted_address);
    setLatLng({ lat, lng });
  };

  const handleMarkerClick = (lat: number, lng: number) => {
    console.log("handleMarkerClick")
    setSelectedMarker({ lat, lng });
  }

  const handleCloseCommentBox = () => {
    setLocationTaken(false);
  };

  const setCurrentLocation = (lat: number, lng: number) => {
    console.log("Updating current location to: ", lat, lng);
    setLatLng({ lat, lng });
  };

  const handleDragStart = () => {
    setIsPanning(true);
    console.log('User started panning the map1');
  };

  const handleDragEnd = () => {
    setIsPanning(false);
    console.log('User stopped panning the map1');
    if (mapInstance) {
      const center = mapInstance.getCenter();
      console.log('Center:', center); // Log center
      if (center) {
        const lat = center.lat();
        const lng = center.lng();
        console.log('Lat:', lat, 'Lng:', lng); // Log lat and lng
        setCurrentLocation(lat, lng); // Update the current location with the new center
      }
    }
  };

  const handleMapLoad = (map: any) => {
    setMapInstance(map);
    console.log('Map loaded:', map); // Log map load

  };

  return (
    
    <div style={{ height: '100vh' }}>
      
      {!userExists && <UserName />}
      {userExists && ( 
        <>
          <Account/>
          
          <GoogleMap onMarkerClick={handleMarkerClick} onDoubleClick={handleMapDoubleClick} setCurrentLocation={setCurrentLocation} onPanningStart={handleDragStart} onPanningEnd={handleDragEnd} onLoad={handleMapLoad}/>
          <Chat address={address} usernameStored={storedUsernames}/> {/*This is for all cases the chat will appear */}
          {latLng && <CrimeBox address={address} lat={latLng.lat} lng={latLng.lng} />} {/* Pass lat, lng, and address to CrimeBox */}
          {commentPosition && <Chat lat={commentPosition.lat} lng={commentPosition.lng} address={address} usernameStored={storedUsernames} />} {/* This is for when there is a commentPosition, the chat appears with all the details */}
          {locationTaken && latLng && (
            <CommentBox latLng={latLng} address={address} onClose={handleCloseCommentBox} />
          )} {/*When a near pin gets dropped bring up the comment box. */}
        </>
      )}
    </div>
  )
}

export default App
