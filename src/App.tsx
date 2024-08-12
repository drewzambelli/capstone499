import GoogleMap from "./components/GoogleMap";
import Chat from "./components/Chat";
import { useState, useEffect } from 'react';
import './App.css';
import UserName from './components/userName';
import CommentBox from './components/CommentBox';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";
import Account from "./components/Account";
import LogoutButton from './components/LogOut'; 
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";

export type AutocompleteMode = { id: string; label: string };

function App() {
  const [userExists, setUserExists] = useState(false);
  const [storedUsernames, setStoredUsername] = useState<string | null>('');
  const [commentPosition, setCommentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [locationTaken, setLocationTaken] = useState<boolean>(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [signUp, setSignUp] = useState<boolean> (false);
  const [loading, setLoading] = useState(false); // 8/8/24 DZ fine tune add
  // const mapRef = useRef<{ changeMapLocation: (lat: number, lng: number) => void } | null>(null);


  const checkUserExists = async () => {
    setLoading(true); // 8/8/24 DZ fine tune add
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
      } finally {
        setLoading(false); // 8/8/24 DZ fine tune add
      }
    }
  };

  const checkLocationExists = async (location: google.maps.LatLngLiteral) => {
    const result = await axios.get(`http://localhost:3000/api/getLocationAddress/lng=${location.lng}/lat=${location.lat}`);
    const address = result.data.address;
    try {
      let locationExist = await axios.get(`http://localhost:3000/api/checkComment/address=${address}`);
      if (locationExist.data.address === null) {
        setLocationTaken(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('username'); // Assuming username is stored in local storage
    setUserExists(false);
    setStoredUsername(null); // Optionally reset other states related to the user session
  };

  useEffect(() => {
    checkUserExists();
  }, []);


  const handleMapDoubleClick = async (lat: number, lng: number) => {
    checkLocationExists({lat, lng});
    setCommentPosition({ lat, lng });
    let result = await axios.get(`http://localhost:3000/api/getLocationAddress/lng=${lng}/lat=${lat}`);
    setAddress(result.data.formatted_address);
    setLatLng({ lat, lng });
  };

  const handleMarkerClick = async (lat: number, lng: number) => {
    setSelectedMarker({ lat, lng });
    const result = await axios.get(`http://localhost:3000/api/getCommentsByLatLng?lat=${lat}&lng=${lng}`);
    setComments(result.data.comments);
  };

  const handleCloseCommentBox = () => {
    setLocationTaken(false);
    // window.location.reload() //DM: Maybe add this, it reloads the page so that the comments don't stay there
  };

  return (
    <div style={{ height: '100vh' }}>
      {loading && <div>Loading...</div>} {/* 8/8/24 DZ fine tune add */}
      {!userExists && !signUp && <UserName setSignUp={setSignUp}/>}
      {signUp && !userExists &&  <SignUp setSignUp={setSignUp}/>}
      {userExists && (
        <>
          <Account />
          <LogoutButton onLogout={logout} />
          <GoogleMap onDoubleClick={handleMapDoubleClick} />
          <Chat comments={comments} address={address} usernameStored={storedUsernames} /> {/* This is for all cases the chat will appear */}
          {/* <CrimeBox /> */}
          {commentPosition && <Chat lat={commentPosition.lat} lng={commentPosition.lng} address={address} usernameStored={storedUsernames} comments={comments} />} {/* This is for when there is a commentPosition, the chat appears with all the details */}
          {locationTaken && latLng && (
            <CommentBox latLng={latLng} address={address} onClose={handleCloseCommentBox} />
          )} {/* When a near pin gets dropped bring up the comment box. */}
        </>
      )}
      <Footer/>
    </div>
  );
}

export default App;
