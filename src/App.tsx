import GoogleMap from "./components/GoogleMap"
import Chat from "./components/Chat"
import { useState, useEffect } from 'react'
import './App.css'
import UserName from './components/userName';
import CommentBox from './components/CommentBox';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios"
import Account from "./components/Account";

export type AutocompleteMode = { id: string; label: string };

function App() {
  const [userExists, setUserExists] = useState(false);
  const [storedUsernames, setStoredUsername] = useState<string | null>('');
  const [commentPosition, setCommentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [locationTaken, setLocationTaken] = useState<boolean>(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);

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
    setSelectedMarker({ lat, lng });
  }

  const handleCloseCommentBox = () => {
    setLocationTaken(false);
  };

  return (
    <div style={{ height: '100vh' }}>
      {!userExists && <UserName />}
      {userExists && (
        <>
          <Account/>
          <GoogleMap onMarkerClick={handleMarkerClick} onDoubleClick={handleMapDoubleClick} />
          <Chat address={address} usernameStored={storedUsernames}/> {/*This is for all cases the chat will appear */}
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
